import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { User, Calendar, Mail, Crown, Edit3 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useHabits } from "@/context/HabitContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LevelProgress } from "@/components/rewards/LevelProgress";
import { BadgeGrid } from "@/components/dashboard/BadgeGrid";
import { RecentActivity } from "@/components/garden/RecentActivity";
import { ProfileEditDialog } from "@/components/profile/ProfileEditDialog";

const ProfilePage: React.FC = () => {
  const { user, profile } = useAuth();
  const { stats, habits } = useHabits();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (!user || !profile) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Calculate weekly completion rate from existing data
  const calculateWeeklyCompletionRate = () => {
    const today = new Date();
    const weekStart = new Date();
    weekStart.setDate(today.getDate() - today.getDay());
    
    const totalHabitsThisWeek = habits.filter(h => !h.isArchived && h.frequency === 'daily').length * 7 + 
      habits.filter(h => !h.isArchived && h.frequency === 'weekly').length;
    
    const completionsThisWeek = habits
      .filter(h => !h.isArchived)
      .reduce((acc, habit) => {
        const thisWeekCompletions = habit.completedDates.filter(date => {
          const completionDate = new Date(date);
          return completionDate >= weekStart;
        });
        
        return acc + thisWeekCompletions.length;
      }, 0);
    
    return totalHabitsThisWeek > 0 
      ? Math.round((completionsThisWeek / totalHabitsThisWeek) * 100) 
      : 0;
  };

  const weeklyCompletionRate = calculateWeeklyCompletionRate();

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="text-2xl">
                  {getInitials(profile.display_name || profile.full_name || user.email || 'User')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">
                    {profile.display_name || profile.full_name || 'User'}
                  </h1>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditDialogOpen(true)}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
                
                <div className="flex items-center gap-4 text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatDate(user.created_at)}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    Habit Builder
                  </Badge>
                  {stats.currentStreak > 0 && (
                    <Badge variant="outline">
                      {stats.currentStreak} day streak
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Level Progress */}
        <LevelProgress stats={stats} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Active Habits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{habits.length}</div>
              <p className="text-sm text-muted-foreground">Currently tracking</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Weekly Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-500">
                {weeklyCompletionRate}%
              </div>
              <p className="text-sm text-muted-foreground">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Total Days Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-500">
                {Math.ceil((new Date().getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))}
              </div>
              <p className="text-sm text-muted-foreground">Since joining</p>
            </CardContent>
          </Card>
        </div>

        {/* Badges Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Badges & Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BadgeGrid />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity habits={habits} />
          </CardContent>
        </Card>

        <ProfileEditDialog 
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
