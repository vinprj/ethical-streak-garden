
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useBuddyData } from "@/hooks/useBuddyData";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { UserRoundPlus, Send, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const invitationSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().max(200, "Message must be 200 characters or less.").optional(),
});

export const InvitationForm: React.FC = () => {
  const { user } = useAuth();
  const { sendConnectionRequest, refetch, connections, pendingRequests } = useBuddyData();

  const form = useForm<z.infer<typeof invitationSchema>>({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      email: "",
      message: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof invitationSchema>) => {
    if (!user) return;

    if (values.email.toLowerCase() === user.email?.toLowerCase()) {
      form.setError("email", { message: "You cannot send an invitation to yourself." });
      return;
    }

    if (connections.some(c => c.addressee.email?.toLowerCase() === values.email.toLowerCase() || c.requester.email?.toLowerCase() === values.email.toLowerCase())) {
        form.setError("email", { message: "You are already connected to this user." });
        return;
    }
    
    // This check is a bit simplistic as it only checks requests sent by the current user
    if (pendingRequests.some(req => req.recipient_email.toLowerCase() === values.email.toLowerCase() && req.sender_id === user.id)) {
      form.setError("email", { message: "A connection request is already pending for this email." });
      return;
    }

    const { error } = await sendConnectionRequest(values.email, values.message);

    if (error) {
      toast.error("Failed to send invitation", { description: error });
    } else {
      toast.success("Invitation sent!", { description: `Your request to ${values.email} has been sent.` });
      form.reset();
      refetch();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <UserRoundPlus className="h-5 w-5 text-primary" />
          Invite a Buddy
        </CardTitle>
        <CardDescription>
          Send an invitation to connect with a friend via email. They must have an account to receive it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Friend's Email</FormLabel>
                  <FormControl>
                    <Input placeholder="friend@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Let's be habit buddies!"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Send Invitation
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
