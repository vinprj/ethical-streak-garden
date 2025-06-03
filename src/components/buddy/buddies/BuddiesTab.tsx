
import React from "react";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";
import { useBuddyData } from "@/hooks/useBuddyData";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

export const BuddiesTab: React.FC<{ onNavigateToConnect: () => void }> = ({ onNavigateToConnect }) => {
  const { user } = useAuth();
  const { connections, removeConnection, loading } = useBuddyData();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-4">
        <div className="p-4 rounded-full bg-muted/50">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium">No buddies yet</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Connect with friends to share your habit journey and encourage each other
          </p>
        </div>
        <Button variant="default" onClick={onNavigateToConnect} className="mt-4">
          <UserPlus className="h-4 w-4 mr-2" />
          Connect with buddies
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Your Buddies</h3>
          <p className="text-sm text-muted-foreground">
            You have {connections.length} active connection{connections.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onNavigateToConnect}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add More
        </Button>
      </div>
      
      <div className="grid gap-4">
        {connections.map(connection => {
          const buddy = connection.requester_id === user?.id ? connection.addressee : connection.requester;
          
          return (
            <Card key={connection.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {buddy.full_name?.charAt(0).toUpperCase() || buddy.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">{buddy.full_name || 'Unknown'}</h4>
                      <p className="text-sm text-muted-foreground">{buddy.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Connected {new Date(connection.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeConnection(connection.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
