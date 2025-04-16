
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Copy, RefreshCw, UserCheck, UserX } from "lucide-react";
import { useBuddy } from "@/context/BuddyContext";
import { toast } from "sonner";

export const ConnectTab: React.FC = () => {
  const [inviteInputValue, setInviteInputValue] = useState("");
  const { inviteCode, generateInviteCode, pendingRequests, acceptBuddyRequest, declineBuddyRequest } = useBuddy();
  
  // Handle copying invite code
  const handleCopyCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      toast.success("Invite code copied to clipboard");
    }
  };
  
  // Handle submitting an invite code
  const handleSubmitCode = () => {
    if (inviteInputValue.trim()) {
      // In a real app, this would verify the code with a backend
      toast.success("Connection request sent", {
        description: "You'll be connected when they accept"
      });
      setInviteInputValue("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4 rounded-md border p-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Share your invite code</h3>
          <div className="flex gap-2">
            <Input 
              value={inviteCode || "Generate an invite code"} 
              readOnly 
              className="font-mono"
            />
            <Button variant="outline" size="icon" onClick={handleCopyCode} disabled={!inviteCode}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={generateInviteCode}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Share this code with friends you want to connect with
          </p>
        </div>
        
        <div className="pt-2">
          <h3 className="text-sm font-medium mb-2">Enter a buddy's invite code</h3>
          <div className="flex gap-2">
            <Input 
              value={inviteInputValue}
              onChange={(e) => setInviteInputValue(e.target.value)}
              placeholder="Enter invite code"
              className="font-mono"
            />
            <Button onClick={handleSubmitCode}>
              <UserPlus className="h-4 w-4 mr-2" />
              Connect
            </Button>
          </div>
        </div>
        
        {/* Pending requests */}
        {pendingRequests.length > 0 && (
          <div className="pt-4">
            <h3 className="text-sm font-medium mb-3">Pending requests</h3>
            <div className="space-y-2">
              {pendingRequests.map(request => (
                <div key={request.id} className="flex justify-between items-center p-2 bg-muted/40 rounded-md">
                  <span>{request.name}</span>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" 
                      onClick={() => acceptBuddyRequest(request.id)} 
                      className="h-8 px-2 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30">
                      <UserCheck className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" 
                      onClick={() => declineBuddyRequest(request.id)} 
                      className="h-8 px-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30">
                      <UserX className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
