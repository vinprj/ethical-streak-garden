
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { generateAllTestData } from '@/utils/generateTestData';
import { useHabits } from '@/context/HabitContext';
import { useGardenContext } from '@/context/GardenContext';
import { useBuddy } from '@/context/BuddyContext';
import { Loader2, Play, Trash2, Database, AlertTriangle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TestDataGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { setHabits, setBadges } = useHabits();
  const { setPlants } = useGardenContext();
  const { setBuddies, setPendingRequests, setMessages } = useBuddy();
  const navigate = useNavigate();
  const [dataStats, setDataStats] = useState<{
    habits: number;
    badges: number;
    plants: number;
    buddies: number;
    messages: number;
  }>({
    habits: 0,
    badges: 0,
    plants: 0,
    buddies: 0,
    messages: 0
  });

  // Update stats from localStorage on mount
  React.useEffect(() => {
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
      // Generate more comprehensive test data
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Demo Data Generator
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-300 dark:border-amber-900 rounded-md">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">Demo Mode</p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                This will generate comprehensive sample data to showcase all app features. You can generate new data multiple times.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-muted/40 rounded-md text-center">
            <div className="text-2xl font-bold">{dataStats.habits}</div>
            <div className="text-xs text-muted-foreground mt-1">Habits</div>
          </div>
          <div className="p-4 bg-muted/40 rounded-md text-center">
            <div className="text-2xl font-bold">{dataStats.badges}</div>
            <div className="text-xs text-muted-foreground mt-1">Badges</div>
          </div>
          <div className="p-4 bg-muted/40 rounded-md text-center">
            <div className="text-2xl font-bold">{dataStats.buddies}</div>
            <div className="text-xs text-muted-foreground mt-1">Buddies</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-muted/40 rounded-md text-center">
            <div className="text-2xl font-bold">{dataStats.plants}</div>
            <div className="text-xs text-muted-foreground mt-1">Plants</div>
          </div>
          <div className="p-4 bg-muted/40 rounded-md text-center">
            <div className="text-2xl font-bold">{dataStats.messages}</div>
            <div className="text-xs text-muted-foreground mt-1">Messages</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span>Demo data includes:</span>
          </div>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-5">
            <li><span className="text-primary font-medium">16 habits</span> across 8 different categories</li>
            <li>Various streak patterns (consistent, occasional, weekend)</li>
            <li>Long streaks (30+ days) to showcase garden growth stages</li>
            <li><span className="text-primary font-medium">9 achievement badges</span> based on milestones</li>
            <li>Plant data visualization in the garden feature</li>
            <li><span className="text-primary font-medium">3 habit buddies</span> with different activity levels</li>
            <li><span className="text-primary font-medium">2 pending buddy requests</span> to demonstrate the connection flow</li>
            <li>Sample messages and encouragements between buddies</li>
          </ul>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <div className="flex justify-between w-full">
          <Button 
            variant="outline" 
            onClick={clearAllData}
            className="gap-1.5"
          >
            <Trash2 className="h-4 w-4" />
            Clear All Data
          </Button>
          <Button 
            onClick={applyTestData} 
            disabled={isGenerating}
            className="gap-1.5"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Generate Demo Data
              </>
            )}
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          className="text-xs w-full flex gap-1.5 text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/dashboard')}
        >
          <Sparkles className="h-3.5 w-3.5" />
          After generating data, go to Dashboard to see all features
        </Button>
      </CardFooter>
    </Card>
  );
};
