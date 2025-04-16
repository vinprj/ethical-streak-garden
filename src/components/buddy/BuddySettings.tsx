
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBuddy, Buddy } from "@/context/BuddyContext";
import { useHabits } from "@/context/HabitContext";
import { toast } from "sonner";
import { 
  UserPlus, 
  Copy, 
  RefreshCw, 
  Users, 
  Shield, 
  MessageCircle, 
  BellRing, 
  UserCheck, 
  UserX,
  Trash2, 
  Eye, 
  EyeOff, 
  CheckCircle
} from "lucide-react";

export const BuddySettings: React.FC = () => {
  const [inviteInputValue, setInviteInputValue] = useState("");
  const [activeTab, setActiveTab] = useState("connect");
  
  const { 
    buddies, 
    pendingRequests, 
    inviteCode, 
    generateInviteCode, 
    acceptBuddyRequest,
    declineBuddyRequest,
    removeBuddy,
    updateSharedHabits,
    toggleAnonymous,
    privacyLevel,
    setPrivacyLevel
  } = useBuddy();
  
  const { habits } = useHabits();
  
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

  // Mock function to simulate sending encouragement
  const handleSendEncouragement = (buddyId: string, message: string) => {
    toast.success("Encouragement sent!");
  };

  return (
    <Card className="border border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Habit Buddy
        </CardTitle>
        <CardDescription>
          Connect with friends for mutual encouragement and accountability
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="connect">Connect</TabsTrigger>
            <TabsTrigger value="buddies">
              Buddies
              {buddies.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                  {buddies.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          
          {/* Connect Tab */}
          <TabsContent value="connect" className="space-y-4">
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
          </TabsContent>
          
          {/* Buddies Tab */}
          <TabsContent value="buddies" className="space-y-4">
            {buddies.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center space-y-2">
                <Users className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="text-base font-medium">No buddies yet</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with friends to share your habit journey and encourage each other
                </p>
                <Button variant="outline" onClick={() => setActiveTab("connect")} className="mt-2">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Connect with buddies
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {buddies.map(buddy => (
                  <BuddyCard 
                    key={buddy.id}
                    buddy={buddy}
                    onRemove={() => removeBuddy(buddy.id)}
                    onToggleAnonymous={() => toggleAnonymous(buddy.id)}
                    onSendEncouragement={(msg) => handleSendEncouragement(buddy.id, msg)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-4">
            <div className="space-y-4 rounded-md border p-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Privacy Level</h3>
                <RadioGroup
                  value={privacyLevel}
                  onValueChange={(val) => setPrivacyLevel(val as 'minimal' | 'moderate' | 'open')}
                  className="space-y-2 pt-1"
                >
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="minimal" id="minimal-privacy" />
                    <div className="grid gap-0.5">
                      <Label htmlFor="minimal-privacy" className="cursor-pointer">Minimal Sharing</Label>
                      <p className="text-xs text-muted-foreground">Only share streak counts, no habit details</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="moderate" id="moderate-privacy" />
                    <div className="grid gap-0.5">
                      <Label htmlFor="moderate-privacy" className="cursor-pointer">Moderate Sharing</Label>
                      <p className="text-xs text-muted-foreground">Share streak counts and habit names for selected habits</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="open" id="open-privacy" />
                    <div className="grid gap-0.5">
                      <Label htmlFor="open-privacy" className="cursor-pointer">Open Sharing</Label>
                      <p className="text-xs text-muted-foreground">Share full details for selected habits</p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="pt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="receive-encouragement">Receive Encouragement</Label>
                    <p className="text-xs text-muted-foreground">Allow buddies to send encouragements</p>
                  </div>
                  <Switch id="receive-encouragement" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="buddy-notifications">Buddy Notifications</Label>
                    <p className="text-xs text-muted-foreground">Get notified about buddy activity</p>
                  </div>
                  <Switch id="buddy-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="anonymous-connections">Anonymous Mode</Label>
                    <p className="text-xs text-muted-foreground">Hide your identity from new connections</p>
                  </div>
                  <Switch id="anonymous-connections" />
                </div>
              </div>
              
              <div className="pt-3">
                <p className="text-xs text-muted-foreground bg-muted p-2 rounded flex items-start">
                  <Shield className="h-3.5 w-3.5 mr-1.5 mt-0.5 flex-shrink-0" />
                  Your privacy is important! You control what you share and can disconnect from buddies at any time.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Buddy Card component
interface BuddyCardProps {
  buddy: Buddy;
  onRemove: () => void;
  onToggleAnonymous: () => void;
  onSendEncouragement: (message: string) => void;
}

const BuddyCard: React.FC<BuddyCardProps> = ({ 
  buddy, 
  onRemove, 
  onToggleAnonymous,
  onSendEncouragement
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Format the connection date
  const connectionDate = new Date(buddy.connectionDate).toLocaleDateString();
  
  return (
    <div className="rounded-md border">
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              {buddy.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-medium flex items-center gap-1.5">
                {buddy.name}
                {buddy.isAnonymous && (
                  <Badge variant="secondary" className="text-[10px] h-5 px-1.5">Anonymous</Badge>
                )}
                {buddy.lastActive && new Date(buddy.lastActive).getTime() > Date.now() - 86400000 && (
                  <Badge variant="success" className="text-[10px] h-5 px-1.5 py-0">Active Today</Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                Connected since {connectionDate}
              </div>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "Less" : "More"}
          </Button>
        </div>
        
        {/* Expanded section */}
        {isExpanded && (
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Send encouragement</h4>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="text-xs h-7"
                  onClick={() => onSendEncouragement("Keep it up!")}>
                  Keep it up! 🎯
                </Button>
                <Button size="sm" variant="outline" className="text-xs h-7"
                  onClick={() => onSendEncouragement("Great progress!")}>
                  Great progress! ⭐
                </Button>
                <Button size="sm" variant="outline" className="text-xs h-7"
                  onClick={() => onSendEncouragement("You're on fire!")}>
                  You're on fire! 🔥
                </Button>
              </div>
            </div>
            
            <div className="pt-2 flex flex-wrap gap-2">
              <Button size="sm" variant="ghost" className="text-xs h-8"
                onClick={onToggleAnonymous}>
                {buddy.isAnonymous ? (
                  <>
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    Show Identity
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3.5 w-3.5 mr-1" />
                    Go Anonymous
                  </>
                )}
              </Button>
              
              <Button size="sm" variant="ghost" className="text-xs h-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                onClick={onRemove}>
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Remove Buddy
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Streak info */}
      <div className="px-4 py-3 bg-muted/30 border-t flex justify-between items-center">
        <div className="text-xs">
          <span className="font-medium">{buddy.sharedHabits.length}</span> habits shared
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <MessageCircle className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <BellRing className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
