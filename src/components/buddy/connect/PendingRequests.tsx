
import React from 'react';
import { useBuddyData } from '@/hooks/useBuddyData';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, UserCheck, UserX } from 'lucide-react';

export const PendingRequests: React.FC = () => {
    const { pendingRequests, acceptConnectionRequest, declineConnectionRequest, refetch } = useBuddyData();

    if (pendingRequests.length === 0) {
        return null;
    }

    const handleAcceptRequest = async (requestId: string) => {
        await acceptConnectionRequest(requestId);
        toast.success("Connection accepted!");
        refetch();
    };

    const handleDeclineRequest = async (requestId: string) => {
        await declineConnectionRequest(requestId);
        toast.info("Connection request declined.");
        refetch();
    };

    return (
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
                      <h4 className="font-medium">{request.sender.full_name || 'Unknown User'}</h4>
                      <p className="text-sm text-muted-foreground">{request.sender.email}</p>
                      {request.message && (
                        <p className="text-xs text-muted-foreground mt-1 italic">"{request.message}"</p>
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
    );
}
