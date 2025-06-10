
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Sprout, Trophy, Users, MessageCircle } from 'lucide-react';

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
  const items = [
    { 
      label: 'Habits', 
      count: stats.habits, 
      icon: CheckCircle2,
      color: 'bg-blue-500/10 text-blue-600'
    },
    { 
      label: 'Badges', 
      count: stats.badges, 
      icon: Trophy,
      color: 'bg-yellow-500/10 text-yellow-600'
    },
    { 
      label: 'Plants', 
      count: stats.plants, 
      icon: Sprout,
      color: 'bg-green-500/10 text-green-600'
    },
    { 
      label: 'Buddy Connections', 
      count: stats.buddies, 
      icon: Users,
      color: 'bg-purple-500/10 text-purple-600'
    },
    { 
      label: 'Messages', 
      count: stats.messages, 
      icon: MessageCircle,
      color: 'bg-orange-500/10 text-orange-600'
    }
  ];

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Current data in your app:
      </p>
      
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
              <div className={`p-1.5 rounded-md ${item.color}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{item.label}</p>
                <Badge variant="secondary" className="text-xs h-5 px-1.5">
                  {item.count}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-xs text-muted-foreground bg-muted/20 p-2 rounded">
        💡 Demo data includes realistic habits, garden plants, achievements, and buddy connections to showcase all features.
      </div>
    </div>
  );
};
