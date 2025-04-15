
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHabits } from "@/context/HabitContext";
import { Habit, HabitCategory, HabitFrequency } from "@/types/habit";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be 50 characters or less"),
  description: z.string().max(200, "Description must be 200 characters or less").optional(),
  frequency: z.enum(["daily", "weekly", "once"] as const),
  category: z.enum(["health", "fitness", "mindfulness", "productivity", "learning", "creativity", "social", "other"] as const),
});

type HabitFormValues = z.infer<typeof formSchema>;

interface HabitFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingHabit?: Habit;
}

export const HabitForm: React.FC<HabitFormProps> = ({ isOpen, onClose, editingHabit }) => {
  const { addHabit, updateHabit } = useHabits();
  
  // Default form values
  const defaultValues: HabitFormValues = editingHabit 
    ? {
        name: editingHabit.name,
        description: editingHabit.description,
        frequency: editingHabit.frequency,
        category: editingHabit.category,
      }
    : {
        name: "",
        description: "",
        frequency: "daily",
        category: "productivity",
      };
  
  const form = useForm<HabitFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  function onSubmit(values: HabitFormValues) {
    if (editingHabit) {
      updateHabit(editingHabit.id, values);
    } else {
      addHabit(values);
    }
    form.reset();
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingHabit ? "Edit Habit" : "Create New Habit"}
          </DialogTitle>
          <DialogDescription>
            {editingHabit 
              ? "Update your habit details below."
              : "Design a new habit that aligns with your goals."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Habit Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Drink water" {...field} />
                  </FormControl>
                  <FormDescription>
                    A short, clear name for your habit
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Drink 8 glasses of water throughout the day" {...field} />
                  </FormControl>
                  <FormDescription>
                    Add details about your habit
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="once">One-time</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="fitness">Fitness</SelectItem>
                        <SelectItem value="mindfulness">Mindfulness</SelectItem>
                        <SelectItem value="productivity">Productivity</SelectItem>
                        <SelectItem value="learning">Learning</SelectItem>
                        <SelectItem value="creativity">Creativity</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {editingHabit ? "Save Changes" : "Create Habit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
