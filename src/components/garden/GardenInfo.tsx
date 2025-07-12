
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Sprout, Flower, Award } from "lucide-react";
import { cn } from "@/lib/utils";

export const GardenInfo: React.FC = () => {
  return <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
            <Leaf className="h-5 w-5 text-primary" />
            How Your Routine Garden Works
          </h3>
          
          <div className="space-y-4">
            <p>The Routine Garden visualizes your routines as plants that grow and flourish as you maintain your streaks. This provides a calming, rewarding way to track your progress.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className={cn("p-4 rounded-lg bg-secondary/50", "border border-border transition-all duration-200")}>
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <Sprout className="h-4 w-4 text-emerald-500" />
                  Growth Stages
                </h4>
                <p className="text-sm text-muted-foreground">
                  Each plant progresses through stages: seed → sprout → growing → mature → 
                  flowering → fruiting, based on your routine streak.
                </p>
              </div>
              
              <div className={cn("p-4 rounded-lg bg-secondary/50", "border border-border transition-all duration-200")}>
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <Flower className="h-4 w-4 text-pink-500" />
                  Plant Types
                </h4>
                <p className="text-sm text-muted-foreground">
                  Different routine categories grow different types of plants: health (vegetables), 
                  fitness (trees), mindfulness (flowers), and more.
                </p>
              </div>
              
              <div className={cn("p-4 rounded-lg bg-secondary/50", "border border-border transition-all duration-200")}>
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-amber-500" />
                  Special Rewards
                </h4>
                <p className="text-sm text-muted-foreforeground">
                  Reach milestones to attract special visitors to your garden, like butterflies 
                  and birds, bringing extra delight to your progress.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-card rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Accessibility & Energy Usage</h3>
        <p className="mb-4">
          We've designed the Routine Garden with both accessibility and environmental consciousness in mind:
        </p>
        <ul className="space-y-2 list-disc pl-5">
          <li>All plant representations have text alternatives for screen readers</li>
          <li>High-contrast mode enhances visibility</li>
          <li>Eco-conscious mode reduces animations to save energy</li>
          <li>You can completely disable animations while still enjoying the garden</li>
        </ul>
      </div>
    </div>;
};
