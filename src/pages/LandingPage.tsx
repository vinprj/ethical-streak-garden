
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Leaf, Target, Users, Award, TrendingUp, Calendar, User, LogOut } from "lucide-react";
import { useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

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

  const handleStartJourney = useCallback(() => {
    console.log('Navigating to /auth');
    navigate('/auth');
  }, [navigate]);

  const handleDashboard = useCallback(() => {
    console.log('Navigating to /dashboard');
    navigate('/dashboard');
  }, [navigate]);

  const handleSignOut = useCallback(async () => {
    console.log('Signing out user');
    await signOut();
  }, [signOut]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 overflow-hidden">
      {/* User Status Bar - Top Left */}
      {user && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-2">
          <User className="h-4 w-4 text-primary" />
          <span className="text-sm text-foreground">Welcome back!</span>
          <div className="flex gap-2 ml-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDashboard}
              className="h-8 px-3 text-xs"
            >
              Dashboard
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSignOut}
              className="h-8 px-2 text-xs"
            >
              <LogOut className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-16 max-w-4xl mx-auto animate-fade-in" style={{animationDelay: '0.3s'}}>
            {/* First row - 3 items */}
            {features.slice(0, 3).map((feature, index) => (
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
            
            {/* Second row - 2 items centered */}
            <div className="md:col-span-3 flex justify-center gap-6">
              {features.slice(3, 5).map((feature, index) => (
                <div 
                  key={feature.title}
                  className="p-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl hover:bg-card/70 transition-all duration-300 hover:scale-105 hover:shadow-lg w-full max-w-sm"
                  style={{animationDelay: `${0.1 * (index + 3)}s`}}
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
          </div>

          {/* CTA Button */}
          <div className="animate-fade-in" style={{animationDelay: '0.6s'}}>
            {user ? (
              <Button
                size="lg"
                onClick={handleDashboard}
                className="px-12 py-6 text-lg font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Go to Dashboard
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleStartJourney}
                className="px-12 py-6 text-lg font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Start Your Journey
              </Button>
            )}
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
