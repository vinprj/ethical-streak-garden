
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

  const createDemoUsers = async () => {
    if (!user) return [];

    // Generate unique IDs for demo users to avoid conflicts
    const demoUserIds = [
      crypto.randomUUID(),
      crypto.randomUUID(),
      crypto.randomUUID()
    ];

    const demoUsers = [
      {
        id: demoUserIds[0],
        email: `demo.alex.${Date.now()}@habitflow.com`,
        full_name: 'Alex Chen',
        avatar_url: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=64&h=64&fit=crop&crop=face'
      },
      {
        id: demoUserIds[1],
        email: `demo.jordan.${Date.now()}@habitflow.com`,
        full_name: 'Jordan Smith',
        avatar_url: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=64&h=64&fit=crop&crop=face'
      },
      {
        id: demoUserIds[2],
        email: `demo.taylor.${Date.now()}@habitflow.com`,
        full_name: 'Taylor Kim',
        avatar_url: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=64&h=64&fit=crop&crop=face'
      }
    ];

    try {
      // First, clean up any existing demo profiles to avoid conflicts
      await supabase
        .from('profiles')
        .delete()
        .like('email', '%@habitflow.com');

      // Insert new demo profiles
      const { data, error } = await supabase
        .from('profiles')
        .insert(demoUsers)
        .select();

      if (error) {
        console.error('Error creating demo users:', error);
        throw error;
      }

      console.log('Created demo users:', data);
      return data || [];
    } catch (error) {
      console.error('Failed to create demo users:', error);
      return [];
    }
  };

  const createDemoConnections = async (demoUsers: any[]) => {
    if (!user || demoUsers.length === 0) return;

    try {
      // Clean up existing demo connections
      await supabase
        .from('user_connections')
        .delete()
        .or(`requester_id.in.(${demoUsers.map(u => u.id).join(',')}),addressee_id.in.(${demoUsers.map(u => u.id).join(',')})`);

      // Create connections with 2 demo users
      const connections = [
        {
          requester_id: demoUsers[0].id,
          addressee_id: user.id,
          status: 'accepted'
        },
        {
          requester_id: user.id,
          addressee_id: demoUsers[1].id,
          status: 'accepted'
        }
      ];

      const { error } = await supabase
        .from('user_connections')
        .insert(connections);

      if (error) {
        console.error('Error creating demo connections:', error);
        throw error;
      }

      console.log('Created demo connections');
    } catch (error) {
      console.error('Failed to create demo connections:', error);
    }
  };

  const createDemoRequests = async (demoUsers: any[]) => {
    if (!user || demoUsers.length < 3) return;

    try {
      // Clean up existing demo requests
      await supabase
        .from('connection_requests')
        .delete()
        .in('sender_id', demoUsers.map(u => u.id));

      // Generate invite token
      const { data: tokenData, error: tokenError } = await supabase
        .rpc('generate_invite_token');

      if (tokenError) {
        console.error('Error generating invite token:', tokenError);
        return;
      }

      // Create a pending request from the third demo user
      const request = {
        sender_id: demoUsers[2].id,
        recipient_email: user.email,
        invite_token: tokenData,
        message: 'Hey! Want to be habit buddies? Let\'s support each other on our journey!',
        status: 'pending'
      };

      const { error } = await supabase
        .from('connection_requests')
        .insert([request]);

      if (error) {
        console.error('Error creating demo request:', error);
        throw error;
      }

      console.log('Created demo request');
    } catch (error) {
      console.error('Failed to create demo request:', error);
    }
  };

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
        await createDemoConnections(demoUsers);
        
        console.log('Creating demo requests...');
        await createDemoRequests(demoUsers);
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
        // Remove demo connections
        await supabase
          .from('user_connections')
          .delete()
          .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

        // Remove demo requests
        await supabase
          .from('connection_requests')
          .delete()
          .eq('recipient_email', user.email);

        // Remove demo profiles (cleanup any test profiles)
        await supabase
          .from('profiles')
          .delete()
          .like('email', '%@habitflow.com');
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
