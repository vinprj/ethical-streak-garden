
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { generateAllTestData } from '@/utils/generateTestData';
import { useHabits } from '@/context/HabitContext';
import { useGardenContext } from '@/context/GardenContext';
import { Loader2, Play, Trash2, Database, AlertTriangle } from 'lucide-react';

export const TestDataGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { habits: existingHabits, badges: existingBadges } = useHabits();
  const { plants: existingPlants } = useGardenContext();
  const [dataStats, setDataStats] = useState<{
    habits: number;
    badges: number;
    plants: number;
  }>({
    habits: existingHabits.length,
    badges: existingBadges.filter(b => b.isUnlocked).length,
    plants: existingPlants.length
  });

  const applyTestData = async () => {
    setIsGenerating(true);
    try {
      // Generate test data
      const { habits, badges, plants } = generateAllTestData();
      
      // Store in localStorage (simulating what our contexts do)
      localStorage.setItem("ethical-habit-tracker-data", JSON.stringify({ 
        habits, 
        badges 
      }));
      
      localStorage.setItem("garden-plants", JSON.stringify(plants));
      
      // Update stats
      setDataStats({
        habits: habits.length,
        badges: badges.filter(b => b.isUnlocked).length,
        plants: plants.length
      });
      
      // Show success message
      toast.success('Test data generated successfully!', {
        description: 'Refresh the page to see the changes.',
        action: {
          label: 'Refresh now',
          onClick: () => window.location.reload()
        }
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
      
      setDataStats({
        habits: 0,
        badges: 0,
        plants: 0
      });
      
      toast.success('All data cleared', {
        description: 'Refresh the page to see the changes.',
        action: {
          label: 'Refresh now',
          onClick: () => window.location.reload()
        }
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Test Data Generator
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-300 dark:border-amber-900 rounded-md">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">Testing Mode</p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                This will replace any existing data with generated test data. Use for testing and demo purposes only.
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
            <div className="text-2xl font-bold">{dataStats.plants}</div>
            <div className="text-xs text-muted-foreground mt-1">Plants</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span>Generated data includes:</span>
          </div>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-5">
            <li>Multiple habits across different categories</li>
            <li>Various streak patterns (consistent, occasional, weekend)</li>
            <li>Long streaks to test garden growth stages</li>
            <li>Badges based on achievements</li>
            <li>Plant data for the garden feature</li>
          </ul>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
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
              Generate Test Data
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
