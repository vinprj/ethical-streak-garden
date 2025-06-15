import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Database } from 'lucide-react';
import { generateTestHabits, generateBadgeData } from '@/utils/testData/habitGenerator';
import { generatePlantData } from '@/utils/testData/plantGenerator';
import { useHabits } from '@/context/HabitContext';
import { useGardenContext } from '@/context/GardenContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { DataGeneratorCard } from './DataGeneratorCard';
import { DataGeneratorActions } from './DataGeneratorActions';
import { DataPreview } from './DataPreview';
import { Tables } from '@/integrations/supabase/types';
import { 
  createDemoUsers, 
  createDemoConnections, 
  createDemoRequests,
  clearDemoUserData
} from '@/utils/testData/userGenerator';

export const TestDataGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { setHabits, setBadges } = useHabits();
  const { setPlants } = useGardenContext();
  const { user } = useAuth();
  const [dataStats, setDataStats] = useState({
    habits: 0,
    badges: 0,
    plants: 0,
    buddies: 0,
    messages: 0
  });

  // Update stats from localStorage and Supabase on mount
  useEffect(() => {
    const updateStats = async () => {
      try {
        // Get localStorage data
        const habitData = localStorage.getItem("ethical-habit-tracker-data");
        let habits = [], badges = [];
        if (habitData) {
          const parsed = JSON.parse(habitData);
          habits = parsed.habits || [];
          badges = parsed.badges || [];
        }
        
        const plantData = localStorage.getItem("garden-plants");
        const plants = plantData ? JSON.parse(plantData) : [];
        
        // Get Supabase buddy data
        let buddyCount = 0;
        if (user) {
          const { data: connections } = await supabase
            .from('user_connections')
            .select('id')
            .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
            .eq('status', 'accepted');
          buddyCount = connections?.length || 0;
        }
        
        setDataStats({
          habits: habits.length,
          badges: badges.filter(b => b.isUnlocked).length,
          plants: plants.length,
          buddies: buddyCount,
          messages: 0
        });
      } catch (error) {
        console.error("Error loading stats:", error);
      }
    };

    updateStats();
  }, [user]);

  const applyTestData = async () => {
    if (!user) {
      toast.error('Please log in to generate demo data');
      return;
    }

    setIsGenerating(true);
    try {
      // Generate habits and plants data
      const habits = generateTestHabits(16);
      const badges = generateBadgeData(habits);
      const plants = generatePlantData(habits);
      
      // Store in localStorage
      localStorage.setItem("ethical-habit-tracker-data", JSON.stringify({ 
        habits, 
        badges 
      }));
      
      localStorage.setItem("garden-plants", JSON.stringify(plants));
      
      // Update context state
      setHabits(habits);
      setBadges(badges);
      setPlants(plants);

      // Create demo buddy data in Supabase
      console.log('Creating demo users...');
      const demoUsers = await createDemoUsers();
      
      if (demoUsers.length > 0) {
        console.log('Creating demo connections...');
        await createDemoConnections(user, demoUsers);
        
        console.log('Creating demo requests...');
        await createDemoRequests(user, demoUsers);
      }
      
      // Update stats
      setDataStats({
        habits: habits.length,
        badges: badges.filter(b => b.isUnlocked).length,
        plants: plants.length,
        buddies: 2,
        messages: 0
      });
      
      toast.success('Demo data generated successfully!', {
        description: 'Your dashboard has been updated with demo data including buddy connections.',
      });
    } catch (error) {
      console.error('Error generating test data:', error);
      toast.error('Failed to generate test data: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsGenerating(false);
    }
  };

  const clearAllData = async () => {
    if (!confirm("This will remove ALL your habit data and buddy connections. Are you sure?")) {
      return;
    }

    try {
      // Clear localStorage
      localStorage.removeItem("ethical-habit-tracker-data");
      localStorage.removeItem("garden-plants");
      localStorage.removeItem("habit-buddy-data");
      
      // Clear context state
      setHabits([]);
      setBadges([]);
      setPlants([]);

      // Clear Supabase buddy data if user is logged in
      if (user) {
        await clearDemoUserData(user);
      }
      
      setDataStats({
        habits: 0,
        badges: 0,
        plants: 0,
        buddies: 0,
        messages: 0
      });
      
      toast.success('All data cleared', {
        description: 'Your dashboard and buddy connections have been reset.',
      });
    } catch (error) {
      console.error('Error clearing data:', error);
      toast.error('Failed to clear all data: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <DataGeneratorCard
      title="Demo Data Generator"
      icon={<Database className="h-5 w-5" />}
      footer={
        <DataGeneratorActions
          isGenerating={isGenerating}
          onGenerate={applyTestData}
          onClear={clearAllData}
        />
      }
    >
      <DataPreview stats={dataStats} />
    </DataGeneratorCard>
  );
};
