
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Award } from "lucide-react";
import { useHabits } from "@/context/HabitContext";
import { LevelProgress } from "@/components/rewards/LevelProgress";
import { BadgesSection } from "@/components/rewards/BadgesSection";
import { RewardsSection } from "@/components/rewards/RewardsSection";

const RewardsPage: React.FC = () => {
  const { stats } = useHabits();

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Award className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Your Rewards</h1>
              <p className="text-muted-foreground">Celebrate your achievements</p>
            </div>
          </div>
        </section>
        
        {/* Level and points section */}
        <LevelProgress stats={stats} />
        
        {/* Badges section */}
        <BadgesSection />
        
        {/* Rewards section */}
        <RewardsSection stats={stats} />
      </div>
    </AppLayout>
  );
};

export default RewardsPage;
