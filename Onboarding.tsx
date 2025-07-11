import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Crown, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const onboardingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
});

type OnboardingForm = z.infer<typeof onboardingSchema>;

export default function Onboarding() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: OnboardingForm) => {
      console.log("Submitting onboarding data:", data);
      return await apiRequest("/api/onboarding", "POST", data);
    },
    onSuccess: (result) => {
      console.log("Onboarding successful:", result);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Welcome to The Divine Vanity!",
        description: "Your spiritual journey begins now.",
      });
      window.location.href = "/";
    },
    onError: (error) => {
      console.error("Onboarding error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: OnboardingForm) => {
    setIsSubmitting(true);
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-soft-gray flex flex-col items-center justify-center px-6">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-divine-gold/20 shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-8 w-8 text-divine-gold" />
            <CardTitle className="text-2xl font-bold text-deep-charcoal">The Divine Vanity</CardTitle>
          </div>
          <CardDescription className="text-gray-600 text-lg">
            Complete your divine profile to begin your spiritual journey
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-deep-charcoal font-medium">First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your first name"
                          className="border-soft-gray focus:border-divine-gold"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-deep-charcoal font-medium">Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your last name"
                          className="border-soft-gray focus:border-divine-gold"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-deep-charcoal font-medium">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        className="border-soft-gray focus:border-divine-gold"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-deep-charcoal font-medium">Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        className="border-soft-gray focus:border-divine-gold"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || mutation.isPending}
                  className="w-full bg-divine-gold hover:bg-divine-gold/90 text-white py-3 font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  {isSubmitting || mutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 animate-spin" />
                      Creating Your Divine Profile...
                    </div>
                  ) : (
                    "Begin My Divine Journey"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              By continuing, you agree to our spiritual terms of service and divine privacy policy.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}