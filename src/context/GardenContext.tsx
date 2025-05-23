
import React, { createContext, useState, useContext, useEffect } from "react";
import { Habit } from "@/types/habit";
import { getPlantTypeForCategory, getNextGrowthStage, getColorForHabit } from "@/utils/plantUtils";

export type PlantGrowthStage = 'seed' | 'sprout' | 'growing' | 'mature' | 'flowering' | 'fruiting';

export type PlantType = 
  'succulent' | 
  'flower' | 
  'tree' | 
  'herb' | 
  'vegetable' | 
  'fruit' | 
  'fern';

export interface PlantData {
  habitId: string;
  type: PlantType;
  growthStage: PlantGrowthStage;
  color: string;
  lastWatered: string | null;
  completionStreak: number;
  specialEffects: string[];
}

interface GardenContextType {
  plants: PlantData[];
  setPlants: React.Dispatch<React.SetStateAction<PlantData[]>>;
  isGardenEnabled: boolean;
  gardenAnimationsLevel: 'none' | 'minimal' | 'standard';
  ecoMode: boolean;
  highContrastGarden: boolean;
  setIsGardenEnabled: (value: boolean) => void;
  setGardenAnimationsLevel: (value: 'none' | 'minimal' | 'standard') => void;
  setEcoMode: (value: boolean) => void;
  setHighContrastGarden: (value: boolean) => void;
  updatePlantGrowth: (habitId: string) => void;
  getPlantByHabitId: (habitId: string) => PlantData | undefined;
  addSpecialEffect: (habitId: string, effect: string) => void;
  handleHabitCompletion: (habit: Habit) => void;
}

export const GardenContext = createContext<GardenContextType>({
  plants: [],
  setPlants: () => {},
  isGardenEnabled: true,
  gardenAnimationsLevel: 'standard',
  ecoMode: false,
  highContrastGarden: false,
  setIsGardenEnabled: () => {},
  setGardenAnimationsLevel: () => {},
  setEcoMode: () => {},
  setHighContrastGarden: () => {},
  updatePlantGrowth: () => {},
  getPlantByHabitId: () => undefined,
  addSpecialEffect: () => {},
  handleHabitCompletion: () => {},
});

export const GardenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plants, setPlants] = useState<PlantData[]>([]);
  const [isGardenEnabled, setIsGardenEnabled] = useState<boolean>(true);
  const [gardenAnimationsLevel, setGardenAnimationsLevel] = useState<'none' | 'minimal' | 'standard'>('standard');
  const [ecoMode, setEcoMode] = useState<boolean>(false);
  const [highContrastGarden, setHighContrastGarden] = useState<boolean>(false);
  
  // Load saved garden preferences from localStorage on initial render
  useEffect(() => {
    const savedPreferences = localStorage.getItem('garden-preferences');
    if (savedPreferences) {
      try {
        const { isEnabled, animationsLevel, eco, highContrast } = JSON.parse(savedPreferences);
        setIsGardenEnabled(isEnabled);
        setGardenAnimationsLevel(animationsLevel);
        setEcoMode(eco);
        setHighContrastGarden(highContrast);
      } catch (error) {
        console.error("Error loading garden preferences:", error);
      }
    }

    // Load plants data
    const savedPlants = localStorage.getItem('garden-plants');
    if (savedPlants) {
      try {
        setPlants(JSON.parse(savedPlants));
      } catch (error) {
        console.error("Error loading garden plants:", error);
      }
    }
  }, []);

  // Save garden preferences when they change
  useEffect(() => {
    const preferences = {
      isEnabled: isGardenEnabled,
      animationsLevel: gardenAnimationsLevel,
      eco: ecoMode,
      highContrast: highContrastGarden
    };
    localStorage.setItem('garden-preferences', JSON.stringify(preferences));
  }, [isGardenEnabled, gardenAnimationsLevel, ecoMode, highContrastGarden]);

  // Save plants data when it changes
  useEffect(() => {
    if (plants.length > 0) {
      localStorage.setItem('garden-plants', JSON.stringify(plants));
    }
  }, [plants]);

  // Update or create a plant based on habit
  const updatePlantForHabit = (habit: Habit) => {
    setPlants(prevPlants => {
      const existingPlantIndex = prevPlants.findIndex(p => p.habitId === habit.id);
      
      if (existingPlantIndex >= 0) {
        // Update existing plant
        const updatedPlants = [...prevPlants];
        const currentPlant = updatedPlants[existingPlantIndex];
        const newGrowthStage = getNextGrowthStage(currentPlant.growthStage, habit.currentStreak);
        
        updatedPlants[existingPlantIndex] = {
          ...currentPlant,
          growthStage: newGrowthStage,
          completionStreak: habit.currentStreak,
          lastWatered: new Date().toISOString()
        };
        
        return updatedPlants;
      } else {
        // Create new plant
        const newPlant: PlantData = {
          habitId: habit.id,
          type: getPlantTypeForCategory(habit.category),
          growthStage: 'seed',
          color: getColorForHabit(habit.category),
          lastWatered: null,
          completionStreak: habit.currentStreak,
          specialEffects: []
        };
        
        return [...prevPlants, newPlant];
      }
    });
  };

  const updatePlantGrowth = (habitId: string) => {
    setPlants(prevPlants => {
      const plantIndex = prevPlants.findIndex(p => p.habitId === habitId);
      if (plantIndex === -1) return prevPlants;
      
      const updatedPlants = [...prevPlants];
      const currentPlant = updatedPlants[plantIndex];
      const newStreak = currentPlant.completionStreak + 1;
      const newGrowthStage = getNextGrowthStage(currentPlant.growthStage, newStreak);
      
      // Add special effects for growth stage changes - now more subtle
      const specialEffects = [...currentPlant.specialEffects];
      if (currentPlant.growthStage !== newGrowthStage) {
        if (newGrowthStage === 'flowering' || newGrowthStage === 'fruiting') {
          specialEffects.push('sparkle');
        }
      }
      
      updatedPlants[plantIndex] = {
        ...currentPlant,
        growthStage: newGrowthStage,
        completionStreak: newStreak,
        lastWatered: new Date().toISOString(),
        specialEffects
      };
      
      return updatedPlants;
    });
  };

  const getPlantByHabitId = (habitId: string) => {
    return plants.find(plant => plant.habitId === habitId);
  };

  const addSpecialEffect = (habitId: string, effect: string) => {
    setPlants(prevPlants => {
      const plantIndex = prevPlants.findIndex(p => p.habitId === habitId);
      if (plantIndex === -1) return prevPlants;
      
      const updatedPlants = [...prevPlants];
      const currentPlant = updatedPlants[plantIndex];
      
      updatedPlants[plantIndex] = {
        ...currentPlant,
        specialEffects: [...currentPlant.specialEffects, effect]
      };
      
      return updatedPlants;
    });
  };

  const handleHabitCompletion = (habit: Habit) => {
    if (!isGardenEnabled) return;
    
    // Check if plant exists, otherwise create one
    const existingPlant = plants.find(p => p.habitId === habit.id);
    
    if (!existingPlant) {
      // Create new plant for this habit
      updatePlantForHabit(habit);
    } else {
      // Update existing plant
      updatePlantGrowth(habit.id);
    }
  };

  return (
    <GardenContext.Provider 
      value={{ 
        plants,
        setPlants, 
        isGardenEnabled, 
        gardenAnimationsLevel, 
        ecoMode,
        highContrastGarden,
        setIsGardenEnabled,
        setGardenAnimationsLevel,
        setEcoMode,
        setHighContrastGarden,
        updatePlantGrowth,
        getPlantByHabitId,
        addSpecialEffect,
        handleHabitCompletion
      }}
    >
      {children}
    </GardenContext.Provider>
  );
};

export const useGardenContext = () => useContext(GardenContext);
