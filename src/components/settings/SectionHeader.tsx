
import React, { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  icon: Icon, 
  title, 
  description 
}) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className="h-5 w-5 text-primary" />
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
};
