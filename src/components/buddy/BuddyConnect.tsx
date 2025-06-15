
import React from "react";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Loader2 } from "lucide-react";
import { useBuddyData } from "@/hooks/useBuddyData";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InvitationForm } from "./connect/InvitationForm";
import { PendingRequests } from "./connect/PendingRequests";

export const BuddyConnect: React.FC = () => {
  const { 
    loading: dataLoading,
    error: dataError,
    refetch
  } = useBuddyData();
  
  if (dataLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading buddy data...</span>
        </div>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="space-y-6">
        <Alert className="border-destructive bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-destructive">
            {dataError}
          </AlertDescription>
        </Alert>
        <Button onClick={refetch} variant="outline" className="w-full">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <InvitationForm />
      <PendingRequests />
      
      <div className="flex items-center gap-2 my-4">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">Privacy & Security</span>
        <Separator className="flex-1" />
      </div>
      
      <div className="bg-muted/30 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          Your email and personal information are kept secure. Only users you connect with can see your habit progress and send you messages.
        </p>
      </div>
    </div>
  );
};
