
import React from "react";

export const AboutSection: React.FC = () => {
  return (
    <div className="space-y-4 bg-card rounded-lg border p-4 transition-all hover:border-primary/30">
      <div>
        <h3 className="font-medium">RoutineGarden</h3>
        <p className="text-sm text-muted-foreground">Version 1.0.0</p>
        <p className="text-sm text-muted-foreground mt-2">
          An ethical habit tracking application designed to help you build consistent habits without manipulative design patterns.
        </p>
      </div>
      
      <div>
        <h3 className="font-medium">Our Ethical Commitment</h3>
        <p className="text-sm text-muted-foreground mt-1">
          We believe in building technology that respects your privacy, attention, and agency. RoutineGarden is designed with ethical principles in mind, avoiding dark patterns and manipulative tactics.
        </p>
      </div>
    </div>
  );
};
