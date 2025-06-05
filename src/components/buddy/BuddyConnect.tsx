
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { UserRoundPlus, UserX, UserCheck, Mail, Send } from "lucide-react";
import { useBuddyData } from "@/hooks/useBuddyData";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export const BuddyConnect: React.FC = () => {
  const { user } = useAuth();
  const { 
    pendingRequests,
    acceptConnectionRequest,
    sendConnectionRequest
  } = useBuddyData();
  
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [sending, setSending] = useState(false);
  
  const handleSendInvitation = async () => {
    if (!inviteEmail.trim() || !user) return;
    
    if (inviteEmail === user.email) {
      toast.error("You can't send an invitation to yourself");
      return;
    }
    
    setSending(true);
    const { error } = await sendConnectionRequest(inviteEmail, inviteMessage);
    
    if (error) {
      toast.error("Failed to send invitation", {
        description: error
      });
    } else {
      toast.success("Invitation sent!");
      setInviteEmail("");
      setInviteMessage("");
    }
    
    setSending(false);
  };

  const handleAcceptRequest = async (requestId: string) => {
    await acceptConnectionRequest(requestId);
    toast.success("Connection accepted!");
  };

  const handleDeclineRequest = async (requestId: string) => {
    // For now, we'll just show a toast - in a full implementation you'd update the database
    toast.success("Connection request declined");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Send Invitation */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <UserRoundPlus className="h-4 w-4 text-primary" />
              Invite a Friend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Send an invitation to connect with a friend via email.
            </p>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Friend's Email</label>
                <Input 
                  type="email"
                  placeholder="friend@example.com" 
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Message (Optional)</label>
                <Input 
                  placeholder="Let's be habit buddies!" 
                  value={inviteMessage}
                  onChange={e => setInviteMessage(e.target.value)}
                />
              </div>
              
              <Button 
                disabled={!inviteEmail.trim() || sending}
                onClick={handleSendInvitation} 
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                {sending ? 'Sending...' : 'Send Invitation'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Pending Requests</h3>
          <div className="space-y-3">
            {pendingRequests.map(request => (
              <Card key={request.id} className="overflow-hidden">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted h-10 w-10 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium">{request.sender.full_name}</h4>
                      <p className="text-sm text-muted-foreground">{request.sender.email}</p>
                      {request.message && (
                        <p className="text-xs text-muted-foreground mt-1">"{request.message}"</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeclineRequest(request.id)}
                      className="flex items-center gap-1"
                    >
                      <UserX className="h-3.5 w-3.5" />
                      <span>Decline</span>
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleAcceptRequest(request.id)}
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
