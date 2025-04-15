
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { TestDataGenerator } from "@/components/debug/TestDataGenerator";
import { SectionHeader } from "@/components/settings/SectionHeader";
import { Bug } from "lucide-react";

const DebugPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6 pb-6">
        <SectionHeader 
          icon={Bug}
          title="Debug Tools"
          description="Testing and development tools"
        />
        
        <div className="grid gap-6 md:grid-cols-1">
          <TestDataGenerator />
        </div>
      </div>
    </AppLayout>
  );
};

export default DebugPage;
