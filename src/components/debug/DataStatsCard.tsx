
import React from 'react';

interface DataStatProps {
  value: number;
  label: string;
  className?: string;
}

const DataStat: React.FC<DataStatProps> = ({ value, label, className }) => {
  return (
    <div className={`p-4 bg-muted/40 rounded-md text-center ${className || ''}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
};

interface DataStatsCardProps {
  stats: {
    habits: number;
    badges: number;
    plants: number;
    buddies: number;
    messages: number;
  };
}

export const DataStatsCard: React.FC<DataStatsCardProps> = ({ stats }) => {
  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <DataStat value={stats.habits} label="Habits" />
        <DataStat value={stats.badges} label="Badges" />
        <DataStat value={stats.buddies} label="Buddies" />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <DataStat value={stats.plants} label="Plants" />
        <DataStat value={stats.messages} label="Messages" />
      </div>
    </div>
  );
};
