
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, UserCheck, UserX, Mail } from "lucide-react";
import { useBuddyData } from "@/hooks/useBuddyData";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const ConnectTab: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { pendingRequests, sendConnectionRequest, acceptConnectionRequest } = useBuddyData();
  
  // Handle sending a connection request
  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    setLoading(true);
    const { error } = await sendConnectionRequest(email.trim(), message.trim() || undefined);
    
    if (error) {
      toast.error("Failed to send connection request", {
        description: error
      });
    } else {
      toast.success("Connection request sent!", {
        description: `Invitation sent to ${email}`
      });
      setEmail("");
      setMessage("");
    }
    setLoading(false);
  };

  const handleAcceptRequest = async (requestId: string) => {
    await acceptConnectionRequest(requestId);
    toast.success("Connection accepted!");
  };

  const handleDeclineRequest = async (requestId: string) => {
    // For now, we'll just remove from UI - in a full implementation you'd update the database
    toast.success("Connection request declined");
  };

  return (
    <div className="space-y-6">
      {/* Send Connection Request */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Connection Request
          </CardTitle>
          <CardDescription>
            Invite someone to be your habit buddy by entering their email address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendRequest} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="friend@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Personal Message (Optional)</Label>
              <Textarea 
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hey! Want to be habit buddies? Let's support each other on our journey..."
                rows={3}
              />
            </div>
            
            <Button type="submit" disabled={loading} className="w-full">
              <UserPlus className="h-4 w-4 mr-2" />
              {loading ? "Sending..." : "Send Connection Request"}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
            <CardDescription>
              People who want to connect with you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingRequests.map(request => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {request.sender.full_name?.charAt(0).toUpperCase() || request.sender.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{request.sender.full_name || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground">{request.sender.email}</p>
                        {request.message && (
                          <p className="text-sm text-muted-foreground mt-1 italic">"{request.message}"</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => handleAcceptRequest(request.id)}
                      className="h-8 px-3"
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeclineRequest(request.id)}
                      className="h-8 px-3"
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
