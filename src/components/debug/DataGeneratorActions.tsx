
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Play, Trash2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DataGeneratorActionsProps {
  isGenerating: boolean;
  onGenerate: () => void;
  onClear: () => void;
}

export const DataGeneratorActions: React.FC<DataGeneratorActionsProps> = ({
  isGenerating,
  onGenerate,
  onClear
}) => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="flex justify-between w-full">
        <Button 
          variant="outline" 
          onClick={onClear}
          className="gap-1.5"
        >
          <Trash2 className="h-4 w-4" />
          Clear All Data
        </Button>
        <Button 
          onClick={onGenerate} 
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
        Creates habits, plants, badges, and buddy connections - go to Dashboard to explore
      </Button>
    </>
  );
};
