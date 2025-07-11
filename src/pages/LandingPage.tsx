
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Leaf, Target, Users, Award, TrendingUp, Calendar } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Target,
      title: "Track Routines",
      description: "Build consistent daily routines that stick"
    },
    {
      icon: TrendingUp,
      title: "Progress Insights",
      description: "Visualize your growth with detailed analytics"
    },
    {
      icon: Users,
      title: "Buddy System",
      description: "Stay motivated with accountability partners"
    },
    {
      icon: Award,
      title: "Rewards & Badges",
      description: "Earn achievements as you build consistency"
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Organize routines that fit your lifestyle"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-muted-foreground/10 animate-float">
          <Leaf className="h-16 w-16" />
        </div>
        <div className="absolute top-40 right-20 text-muted-foreground/10 animate-float" style={{animationDelay: '1s'}}>
          <Leaf className="h-12 w-12" />
        </div>
        <div className="absolute bottom-40 left-20 text-muted-foreground/10 animate-float" style={{animationDelay: '2s'}}>
          <Leaf className="h-20 w-20" />
        </div>
        <div className="absolute bottom-20 right-10 text-muted-foreground/10 animate-float" style={{animationDelay: '0.5s'}}>
          <Leaf className="h-14 w-14" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          {/* Logo and Title */}
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-2xl animate-pulse-light">
                <Leaf className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
              Routine<span className="text-primary">Garden</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
              Cultivate consistent routines and watch your personal growth flourish
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-16 animate-fade-in" style={{animationDelay: '0.3s'}}>
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="p-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl hover:bg-card/70 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{animationDelay: `${0.1 * index}s`}}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="animate-fade-in" style={{animationDelay: '0.6s'}}>
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="px-12 py-6 text-lg font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Start Your Journey
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Free to use • No credit card required
            </p>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      </div>
    </div>
  );
};

export default LandingPage;
