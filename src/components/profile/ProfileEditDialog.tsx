
import React, { useState } from "react";
import { User } from '@supabase/supabase-js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

export const ProfileEditDialog: React.FC<ProfileEditDialogProps> = ({
  open,
  onOpenChange,
  user
}) => {
  const [fullName, setFullName] = useState(user.user_metadata?.full_name || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      if (error) throw error;

      // Also update the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
      }

      toast.success('Profile updated successfully');
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information here.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user.email}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Email cannot be changed
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
