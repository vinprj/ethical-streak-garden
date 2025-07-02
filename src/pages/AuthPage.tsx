
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, LogIn, Leaf, Flower, Sprout } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ email: '', password: '', fullName: '', confirmPassword: '', username: '' });
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [usernameError, setUsernameError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignInData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn(signInData.email, signInData.password);
    setLoading(false);
  };
  
  const validateUsername = (username: string) => {
    if (!username) {
      setUsernameError(null);
      return false;
    }
    const regex = /^[a-z0-9_]{3,20}$/;
    if (!regex.test(username)) {
      setUsernameError('Must be 3-20 lowercase letters, numbers, or underscores.');
      return true;
    }
    setUsernameError(null);
    return false;
  };

  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'username') {
      validateUsername(value);
    }
    setSignUpData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword || validateUsername(signUpData.username)) {
      return;
    }

    setLoading(true);
    await signUp(signUpData.email, signUpData.password, signUpData.fullName, signUpData.username);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-stone-100 p-4 relative overflow-hidden">
      {/* Subtle garden background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top left corner - subtle leaf */}
        <div className="absolute top-8 left-8 opacity-[0.08] text-slate-400">
          <Leaf className="h-32 w-32 rotate-12 transform" />
        </div>
        
        {/* Top right corner - delicate flower */}
        <div className="absolute top-12 right-16 opacity-[0.06] text-slate-400">
          <Flower className="h-24 w-24 -rotate-12 transform" />
        </div>
        
        {/* Bottom left - small sprout */}
        <div className="absolute bottom-20 left-20 opacity-[0.05] text-slate-400">
          <Sprout className="h-20 w-20 rotate-6 transform" />
        </div>
        
        {/* Bottom right - larger leaf */}
        <div className="absolute bottom-8 right-8 opacity-[0.07] text-slate-400">
          <Leaf className="h-28 w-28 -rotate-6 transform" />
        </div>
        
        {/* Center background - very subtle */}
        <div className="absolute top-1/3 left-1/4 opacity-[0.03] text-slate-400">
          <Flower className="h-40 w-40 rotate-45 transform" />
        </div>
        
        {/* Scattered small elements */}
        <div className="absolute top-1/4 right-1/3 opacity-[0.04] text-slate-400">
          <Sprout className="h-16 w-16 rotate-12 transform" />
        </div>
        
        <div className="absolute bottom-1/3 left-1/3 opacity-[0.05] text-slate-400">
          <Leaf className="h-18 w-18 -rotate-24 transform" />
        </div>
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-primary/10 backdrop-blur-sm">
              <Leaf className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome to RoutineGarden</h1>
          <p className="text-muted-foreground">Cultivate your habits and watch your routine bloom</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/90 border-slate-200/60 shadow-xl shadow-slate-200/50">
          <CardContent className="p-6">
            <Tabs defaultValue="signin" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 bg-slate-100/80">
                <TabsTrigger value="signin" className="flex items-center gap-2 data-[state=active]:bg-white/90">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="flex items-center gap-2 data-[state=active]:bg-white/90">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={signInData.email}
                      onChange={handleSignInChange}
                      required
                      className="bg-white/70 border-slate-200 focus:border-primary/50 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={signInData.password}
                      onChange={handleSignInChange}
                      required
                      className="bg-white/70 border-slate-200 focus:border-primary/50 focus:ring-primary/20"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary/90 hover:bg-primary" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-fullName">Full Name</Label>
                    <Input
                      id="signup-fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={signUpData.fullName}
                      onChange={handleSignUpChange}
                      required
                      className="bg-white/70 border-slate-200 focus:border-primary/50 focus:ring-primary/20"
                    />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="signup-username">Username</Label>
                    <Input
                      id="signup-username"
                      name="username"
                      type="text"
                      placeholder="Choose a unique username"
                      value={signUpData.username}
                      onChange={handleSignUpChange}
                      required
                      autoCapitalize="none"
                      autoCorrect="off"
                      className="bg-white/70 border-slate-200 focus:border-primary/50 focus:ring-primary/20"
                    />
                    {usernameError && <p className="text-sm text-destructive">{usernameError}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={signUpData.email}
                      onChange={handleSignUpChange}
                      required
                      className="bg-white/70 border-slate-200 focus:border-primary/50 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      value={signUpData.password}
                      onChange={handleSignUpChange}
                      required
                      className="bg-white/70 border-slate-200 focus:border-primary/50 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={signUpData.confirmPassword}
                      onChange={handleSignUpChange}
                      required
                      className="bg-white/70 border-slate-200 focus:border-primary/50 focus:ring-primary/20"
                    />
                  </div>
                  {signUpData.password !== signUpData.confirmPassword && signUpData.confirmPassword && (
                    <p className="text-sm text-destructive">Passwords do not match</p>
                  )}
                  <Button type="submit" className="w-full bg-primary/90 hover:bg-primary" disabled={loading || !!usernameError || signUpData.password !== signUpData.confirmPassword}>
                    {loading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
