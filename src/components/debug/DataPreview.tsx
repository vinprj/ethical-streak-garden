
import React from 'react';
import { DataStatsCard } from './DataStatsCard';
import { DataFeatureList } from './DataFeatureList';
import { AlertTriangle } from 'lucide-react';
import { AnimatedProfilePicture } from './AnimatedProfilePicture';

interface DataStats {
  habits: number;
  badges: number;
  plants: number;
  buddies: number;
  messages: number;
}

interface DataPreviewProps {
  stats: DataStats;
}

export const DataPreview: React.FC<DataPreviewProps> = ({ stats }) => {
  // Demo avatars for preview
  const demoAvatars = [
    { name: "Alex Chen", src: "/images/avatars/alex.jpg" },
    { name: "Jordan Smith", src: "/images/avatars/jordan.jpg" },
    { name: "Taylor Kim", src: "" }, // This will use the fallback
  ];

  return (
    <>
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

      {/* Profile Pictures Preview */}
      <div className="mb-6">
        <p className="text-sm font-medium mb-3">Demo User Profiles:</p>
        <div className="flex items-center gap-4 mb-4">
          {demoAvatars.map((avatar, index) => (
            <div key={index} className="flex flex-col items-center gap-2 group">
              <AnimatedProfilePicture 
                src={avatar.src} 
                alt={avatar.name} 
                className="h-16 w-16 border-2 border-primary/20 hover:border-primary/50 transition-all" 
              />
              <span className="text-xs text-muted-foreground">{avatar.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>

      <DataStatsCard stats={stats} />
      <DataFeatureList />
    </>
  );
};
