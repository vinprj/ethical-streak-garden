
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { UserRoundPlus, Copy, Check, RefreshCcw, UserX, UserCheck, Mail } from "lucide-react";
import { useBuddy } from "@/context/BuddyContext";
import { toast } from "sonner";

export const BuddyConnect: React.FC = () => {
  const { 
    generateInviteCode, 
    inviteCode, 
    pendingRequests,
    acceptBuddyRequest,
    declineBuddyRequest  
  } = useBuddy();
  
  const [buddyCode, setBuddyCode] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  
  const handleCopyCode = () => {
    if (!inviteCode) return;
    
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    toast.success("Invite code copied to clipboard");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const handleConnectWithCode = () => {
    if (!buddyCode.trim()) {
      toast.error("Please enter a valid buddy code");
      return;
    }
    
    // Simulate sending request
    toast.success("Buddy request sent successfully");
    setBuddyCode("");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Generate Invite Code */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <UserRoundPlus className="h-4 w-4 text-primary" />
              Share Your Buddy Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Generate a code to share with friends so they can connect with you.
            </p>
            
            <div className="space-y-3">
              {inviteCode ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="border rounded-md bg-muted/50 px-3 py-1.5 text-lg font-mono tracking-wider flex-1 text-center">
                      {inviteCode}
                    </div>
                    <Button size="icon" variant="outline" onClick={handleCopyCode}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={generateInviteCode} 
                    className="w-full flex items-center gap-1.5"
                  >
                    <RefreshCcw className="h-3.5 w-3.5" />
                    Generate New Code
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={generateInviteCode} 
                  className="w-full"
                >
                  Generate Invite Code
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Enter Buddy Code */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <UserRoundPlus className="h-4 w-4 text-primary" />
              Connect with a Buddy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Enter the code shared by your friend to connect with them.
            </p>
            
            <div className="space-y-3">
              <Input 
                placeholder="Enter buddy code" 
                value={buddyCode}
                onChange={e => setBuddyCode(e.target.value)}
                className="font-mono tracking-wider text-center"
              />
              
              <Button 
                disabled={!buddyCode.trim()}
                onClick={handleConnectWithCode} 
                className="w-full"
              >
                Connect with Buddy
              </Button>
              
              <p className="text-xs text-center text-muted-foreground pt-1">
                Or connect via <Button variant="link" size="sm" className="h-auto p-0">email invitation</Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-medium">Pending Requests</h3>
          <div className="space-y-3">
            {pendingRequests.map(request => (
              <Card key={request.id} className="overflow-hidden">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted h-10 w-10 rounded-full flex items-center justify-center">
                      {request.avatar ? 
                        <img src={request.avatar} alt={request.name} className="rounded-full" /> :
                        <Mail className="h-5 w-5 text-muted-foreground" />
                      }
                    </div>
                    <div>
                      <h4 className="font-medium">{request.name}</h4>
                      <p className="text-xs text-muted-foreground">Sent a connection request</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => declineBuddyRequest(request.id)}
                      className="flex items-center gap-1"
                    >
                      <UserX className="h-3.5 w-3.5" />
                      <span>Decline</span>
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => acceptBuddyRequest(request.id)}
                      className="flex items-center gap-1"
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      <span>Accept</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-2 my-4">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">Privacy Settings</span>
        <Separator className="flex-1" />
      </div>
      
      <div className="bg-muted/30 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          Control who can connect with you and what information is shared with your buddies by visiting your 
          <Button variant="link" size="sm" className="px-1.5 h-auto py-0">privacy settings</Button>.
        </p>
      </div>
    </div>
  );
};
