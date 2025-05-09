
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Database } from 'lucide-react';
import { generateAllTestData } from '@/utils/testData';
import { useHabits } from '@/context/HabitContext';
import { useGardenContext } from '@/context/GardenContext';
import { useBuddy } from '@/context/BuddyContext';
import { DataGeneratorCard } from './DataGeneratorCard';
import { DataGeneratorActions } from './DataGeneratorActions';
import { DataPreview } from './DataPreview';

export const TestDataGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { setHabits, setBadges } = useHabits();
  const { setPlants } = useGardenContext();
  const { setBuddies, setPendingRequests, setMessages } = useBuddy();
  const [dataStats, setDataStats] = useState({
    habits: 0,
    badges: 0,
    plants: 0,
    buddies: 0,
    messages: 0
  });

  // Update stats from localStorage on mount
  useEffect(() => {
    try {
      const habitData = localStorage.getItem("ethical-habit-tracker-data");
      if (habitData) {
        const { habits = [], badges = [] } = JSON.parse(habitData);
        const plantData = localStorage.getItem("garden-plants");
        const plants = plantData ? JSON.parse(plantData) : [];
        
        const buddyData = localStorage.getItem("habit-buddy-data");
        const buddyInfo = buddyData ? JSON.parse(buddyData) : { buddies: [], messages: [] };
        
        setDataStats({
          habits: habits.length,
          badges: badges.filter(b => b.isUnlocked).length,
          plants: plants.length,
          buddies: buddyInfo.buddies?.length || 0,
          messages: buddyInfo.messages?.length || 0
        });
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  }, []);

  const applyTestData = async () => {
    setIsGenerating(true);
    try {
      // Generate comprehensive test data
      const { habits, badges, plants, buddies, pendingRequests, messages } = generateAllTestData();
      
      // Store in localStorage
      localStorage.setItem("ethical-habit-tracker-data", JSON.stringify({ 
        habits, 
        badges 
      }));
      
      localStorage.setItem("garden-plants", JSON.stringify(plants));
      
      // Store buddy data
      localStorage.setItem("habit-buddy-data", JSON.stringify({
        buddies,
        pendingRequests,
        messages,
        privacyLevel: 'moderate'
      }));
      
      // Update context state directly
      setHabits(habits);
      setBadges(badges);
      setPlants(plants);
      setBuddies(buddies);
      setPendingRequests(pendingRequests);
      setMessages(messages);
      
      // Update stats
      setDataStats({
        habits: habits.length,
        badges: badges.filter(b => b.isUnlocked).length,
        plants: plants.length,
        buddies: buddies.length,
        messages: messages.length
      });
      
      // Show success message
      toast.success('Demo data generated successfully!', {
        description: 'Your dashboard has been updated with demo data.',
      });
    } catch (error) {
      console.error('Error generating test data:', error);
      toast.error('Failed to generate test data');
    } finally {
      setIsGenerating(false);
    }
  };

  const clearAllData = () => {
    if (confirm("This will remove ALL your habit data. Are you sure?")) {
      localStorage.removeItem("ethical-habit-tracker-data");
      localStorage.removeItem("garden-plants");
      localStorage.removeItem("habit-buddy-data");
      
      // Clear context state directly
      setHabits([]);
      setBadges([]);
      setPlants([]);
      setBuddies([]);
      setPendingRequests([]);
      setMessages([]);
      
      setDataStats({
        habits: 0,
        badges: 0,
        plants: 0,
        buddies: 0,
        messages: 0
      });
      
      toast.success('All data cleared', {
        description: 'Your dashboard has been reset.',
      });
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
