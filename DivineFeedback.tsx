import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const feedbackSchema = z.object({
  premiumContentInterest: z.string().min(1, "Please share your thoughts"),
  uniqueFeatureIdeas: z.string().min(1, "Please share your ideas"),
  milestoneRewardIdeas: z.string().min(1, "Please share your reward preferences"),
  pricingPreference: z.string().min(1, "Please select a pricing option"),
  joinFocusGroup: z.boolean().default(false),
  focusGroupName: z.string().optional(),
  focusGroupEmail: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  focusGroupPhone: z.string().optional(),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

export default function DivineFeedback() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      premiumContentInterest: "",
      uniqueFeatureIdeas: "",
      milestoneRewardIdeas: "",
      pricingPreference: "",
      joinFocusGroup: false,
      focusGroupName: "",
      focusGroupEmail: "",
      focusGroupPhone: "",
    },
  });

  const submitFeedback = useMutation({
    mutationFn: async (data: FeedbackFormData) => {
      // Map form data to match database column names
      const mappedData = {
        premiumContentInterest: data.premiumContentInterest,
        uniqueFeatureIdeas: data.uniqueFeatureIdeas,
        milestoneRewardIdeas: data.milestoneRewardIdeas,
        pricingPreference: data.pricingPreference,
        joinFocusGroup: data.joinFocusGroup,
        focusGroupName: data.focusGroupName,
        focusGroupEmail: data.focusGroupEmail,
        focusGroupPhone: data.focusGroupPhone,
      };
      return apiRequest("/api/divine-feedback", "POST", mappedData);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Divine Insight Received ✨",
        description: "Thank you for helping shape this sacred space!",
      });
    },
    onError: (error) => {
      console.error("Feedback submission error:", error);
      toast({
        title: "Submission Error",
        description: "Please try again. Your feedback is precious to us.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FeedbackFormData) => {
    submitFeedback.mutate(data);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-white to-soft-gray p-4">
        <div className="max-w-2xl mx-auto pt-20">
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-divine-gold to-divine-gold/80 flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
                <h2 className="font-playfair text-2xl font-bold text-deep-charcoal mb-4">
                  Thank you for sharing your divine insight!
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  As a token of gratitude, you'll receive a digital blessing in your inbox — and a little surprise is coming soon ✨
                </p>
              </div>
              <Button 
                onClick={() => window.history.back()} 
                className="bg-gradient-to-r from-divine-gold to-divine-gold/90 hover:from-divine-gold/90 hover:to-divine-gold/80 text-white px-8 py-3 rounded-full font-medium shadow-lg"
              >
                Return to Your Sacred Journey
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-soft-gray p-4">
      <div className="max-w-3xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="font-playfair text-3xl font-bold text-deep-charcoal mb-4">
            📜 Refining the Divine
          </h1>
          <h2 className="text-xl font-semibold text-divine-gold mb-4">
            Help Shape the Next Evolution of This Sacred Space
          </h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-600 leading-relaxed mb-6">
              💫 This is more than an app — it's a movement. And your insight is sacred.
            </p>
            <p className="text-gray-600 leading-relaxed">
              You are part of something rare and radiant, and your voice matters here. What you share below helps shape premium content, milestone rewards, and all the divine luxuries we're preparing just for you.
            </p>
            <p className="text-divine-gold font-medium mt-4">
              Let's co-create something breathtaking. ✨
            </p>
          </div>
        </div>

        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8">
            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="space-y-8"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'TEXTAREA') {
                    e.preventDefault();
                  }
                }}
              >
                {/* Question 1 */}
                <FormField
                  control={form.control}
                  name="premiumContentInterest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-deep-charcoal">
                        🧘‍♀️ What type of exclusive or premium content would you love to see inside this sanctuary?
                      </FormLabel>
                      <p className="text-sm text-gray-600 mb-3">
                        (Examples: audio rituals, 1:1 private chat, spiritual video courses, signature Divine Vanity™ products, live prayer rooms, etc.)
                      </p>
                      <FormControl>
                        <Textarea
                          placeholder="Share your vision for premium sacred content..."
                          className="min-h-[100px] border-divine-gold focus:border-divine-gold resize-y"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.stopPropagation();
                            }
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Question 2 */}
                <FormField
                  control={form.control}
                  name="uniqueFeatureIdeas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-deep-charcoal">
                        💡 Are there any features you've *never seen* on other spiritual or wellness apps that you'd love to see here?
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your innovative spiritual feature ideas..."
                          className="min-h-[100px] border-divine-gold focus:border-divine-gold resize-y"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.stopPropagation();
                            }
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Question 3 */}
                <FormField
                  control={form.control}
                  name="milestoneRewardIdeas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-deep-charcoal">
                        🌟 What kind of milestone rewards would make your spiritual journey feel truly seen, special, and celebrated?
                      </FormLabel>
                      <p className="text-sm text-gray-600 mb-3">
                        (Examples: surprise product, free private session, secret content, badge system, divine discounts, etc.)
                      </p>
                      <FormControl>
                        <Textarea
                          placeholder="Share what would make you feel divinely celebrated..."
                          className="min-h-[100px] border-divine-gold focus:border-divine-gold resize-y"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.stopPropagation();
                            }
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Question 4 */}
                <FormField
                  control={form.control}
                  name="pricingPreference"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-lg font-semibold text-deep-charcoal">
                        💸 What price would feel aligned and abundant for premium access?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid gap-3"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="$22/month" id="price1" />
                            <label htmlFor="price1" className="text-gray-700">$22/month</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="$49/month" id="price2" />
                            <label htmlFor="price2" className="text-gray-700">$49/month (current intro offer)</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="$99/month" id="price3" />
                            <label htmlFor="price3" className="text-gray-700">$99/month (includes exclusives + private session)</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="one-time" id="price4" />
                            <label htmlFor="price4" className="text-gray-700">I'd prefer a one-time offering</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Question 5 */}
                <FormField
                  control={form.control}
                  name="joinFocusGroup"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-lg font-semibold text-gray-800">
                        👑 Would you like to join our private focus group to help shape future divine updates?
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="focus-group"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <label htmlFor="focus-group" className="text-gray-700">
                            Yes, I'd love to be part of the divine evolution
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Focus Group Contact Fields */}
                {form.watch("joinFocusGroup") && (
                  <div className="space-y-4 p-4 bg-cream rounded-lg border border-divine-gold/30">
                    <p className="text-sm text-divine-gold font-medium">
                      Perfect! Please share your contact details:
                    </p>
                    
                    <FormField
                      control={form.control}
                      name="focusGroupName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your divine name"
                              className="border-amber-200 focus:border-amber-400"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="focusGroupEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="your@email.com"
                              className="border-amber-200 focus:border-amber-400"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="focusGroupPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="(555) 123-4567"
                              className="border-amber-200 focus:border-amber-400"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={submitFeedback.isPending}
                  className="w-full bg-gradient-to-r from-divine-gold to-divine-gold hover:from-divine-gold hover:to-divine-gold text-white py-4 rounded-full font-medium shadow-lg text-lg"
                >
                  {submitFeedback.isPending ? "Sending Your Divine Insight..." : "Share My Sacred Vision ✨"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      {/* Add bottom padding to ensure submit button is not covered by mobile toolbar */}
      <div className="h-24 md:h-8"></div>
    </div>
  );
}