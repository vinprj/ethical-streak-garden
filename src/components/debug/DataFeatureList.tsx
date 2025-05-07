
import React from 'react';

export const DataFeatureList: React.FC = () => {
  return (
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
  );
};
