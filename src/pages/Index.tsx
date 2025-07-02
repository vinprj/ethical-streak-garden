
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Habit Garden</h1>
        <p className="text-xl text-muted-foreground mb-8">Track your habits and watch your garden grow</p>
        
        <div className="space-y-4">
          <Button 
            size="lg" 
            className="w-full md:w-auto px-8"
            onClick={() => navigate('/dashboard')}
          >
            Get Started
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full md:w-auto px-8"
            onClick={() => navigate('/today')}
          >
            Today's Habits
          </Button>
        </div>
      </div>
      
      <div className="mt-16 text-center text-sm text-muted-foreground">
        <p>Build healthy habits and grow your virtual garden</p>
      </div>
    </div>
  );
};

export default Index;
