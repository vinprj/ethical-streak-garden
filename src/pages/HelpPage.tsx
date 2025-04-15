
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { HelpCircle, FileText, MessageSquare, Heart } from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

const HelpPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <section>
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Help &amp; Resources</h1>
              <p className="text-muted-foreground">Find answers to common questions</p>
            </div>
          </div>
        </section>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Documentation
              </CardTitle>
              <CardDescription>Learn how to use HabitFlow</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">
                Comprehensive guides to all features and settings.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Community
              </CardTitle>
              <CardDescription>Connect with other users</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">
                Share your experience and learn from others.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Support
              </CardTitle>
              <CardDescription>Get help when you need it</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">
                Our team is here to help you succeed.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <section>
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="bg-card rounded-lg border">
            <AccordionItem value="item-1">
              <AccordionTrigger className="px-4">How do I create a new habit?</AccordionTrigger>
              <AccordionContent className="px-4">
                Click the "New Habit" button on the dashboard or today page. Fill in the details like name, description, frequency, and category, then click "Create Habit".
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="px-4">How are streaks calculated?</AccordionTrigger>
              <AccordionContent className="px-4">
                Streaks count consecutive days where you've completed a habit. For daily habits, you need to complete them every day to maintain the streak. For weekly habits, you need to complete them at least once per week.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="px-4">How do I earn points and badges?</AccordionTrigger>
              <AccordionContent className="px-4">
                You earn points for completing habits (5 points per completion) and maintaining streaks (2 points per day in a streak). Badges are awarded for specific achievements like creating your first habit or maintaining a 7-day streak.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="px-4">Is my data private?</AccordionTrigger>
              <AccordionContent className="px-4">
                Yes! By default, all your data is stored locally on your device. The app is designed with privacy in mind, and you can opt out of analytics in Settings. You can also export your data at any time.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger className="px-4">What is Eco-Conscious Mode?</AccordionTrigger>
              <AccordionContent className="px-4">
                Eco-Conscious Mode reduces animations and background processes to save energy and battery life. This aligns with our commitment to sustainability and mindful technology use.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger className="px-4">How do I customize notifications?</AccordionTrigger>
              <AccordionContent className="px-4">
                Go to Settings, then the Notifications section. You can enable or disable notifications, and choose when you want to receive them (morning, afternoon, or evening).
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        
        <section className="mt-4">
          <h2 className="text-xl font-semibold mb-4">About HabitFlow</h2>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-2">Our Ethical Design Principles</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li className="text-sm">
                  <span className="font-medium">Privacy First:</span> Your data belongs to you. We store it locally by default and provide transparency about any data collection.
                </li>
                <li className="text-sm">
                  <span className="font-medium">No Dark Patterns:</span> We avoid manipulative design tactics that create addiction or anxiety.
                </li>
                <li className="text-sm">
                  <span className="font-medium">Inclusive Design:</span> We strive to make our app accessible to everyone with features like high contrast mode and screen reader support.
                </li>
                <li className="text-sm">
                  <span className="font-medium">Sustainable Technology:</span> Our Eco-Conscious Mode helps reduce digital carbon footprint.
                </li>
                <li className="text-sm">
                  <span className="font-medium">Positive Reinforcement:</span> We focus on celebrating achievements rather than punishing lapses.
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
};

export default HelpPage;
