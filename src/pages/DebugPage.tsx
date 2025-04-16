
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { TestDataGenerator } from "@/components/debug/TestDataGenerator";
import { SectionHeader } from "@/components/settings/SectionHeader";
import { Bug, Database, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DebugPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex items-center justify-between">
          <SectionHeader 
            icon={Bug}
            title="Debug Tools"
            description="Testing and development tools"
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1" 
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-1">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Database className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Demo Data</h2>
            </div>
            <TestDataGenerator />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DebugPage;
