
import React from "react";
import { Shield } from "lucide-react";
import { BadgeGrid } from "@/components/dashboard/BadgeGrid";

export const BadgesSection: React.FC = () => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Badges
        </h2>
      </div>
      <BadgeGrid />
    </section>
  );
};
