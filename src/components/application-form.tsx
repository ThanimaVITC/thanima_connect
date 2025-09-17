"use client";

import { useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

import { applicationSchema, type ApplicationData } from "@/app/schema";
import { submitApplication } from "@/app/actions";
import { DEPARTMENTS, DEPARTMENT_DESCRIPTIONS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ApplicationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ApplicationData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "",
      regNo: "",
      branchAndYear: "",
      email: "",
      phone: "",
      previousExperience: "",
      primaryPreference: undefined,
      secondaryPreference: undefined,
      essay1: "",
      essay2: "",
      portfolioLink: "",
    },
  });

  const primaryPreference = form.watch("primaryPreference");

  const processForm = async (data: ApplicationData) => {
    setIsSubmitting(true);
    const result = await submitApplication(data);

    if (result.success) {
      setCurrentStep(4);
    } else {
      toast({
        title: "Submission Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  const nextStep = async () => {
    const fields: FieldPath<ApplicationData>[][] = [
      ["name", "regNo", "branchAndYear", "email", "phone"],
      ["previousExperience"],
      ["primaryPreference", "secondaryPreference"],
      ["essay1", "essay2", "portfolioLink"],
    ];

    const output = await form.trigger(fields[currentStep], {
      shouldFocus: true,
    });

    if (!output) return;

    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    } else {
      await form.handleSubmit(processForm)();
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  if (currentStep === 4) {
    return (
      <div className="py-8 text-center animate-in fade-in-50 duration-500">
        <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />
        <h2 className="mt-4 font-headline text-2xl font-bold">
          Application Submitted!
        </h2>
        <p className="mt-2 text-muted-foreground">
          Thank you for your interest in joining Thanima. We have received your
          application and will be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(processForm)} className="space-y-8">
        <Progress value={((currentStep + 1) / 4) * 100} className="mb-8" />
        <div
          className={cn(
            "space-y-6",
            currentStep === 0 ? "block animate-in fade-in-50" : "hidden"
          )}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="regNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 24BYB1234" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="branchAndYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch and Year of Study</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. CSE, 2nd Year" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
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
                <FormLabel>WhatsApp Number</FormLabel>
                <FormControl>
                  <Input placeholder="Your phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div
          className={cn(
            "space-y-6",
            currentStep === 1 ? "block animate-in fade-in-50" : "hidden"
          )}
        >
          <FormField
            control={form.control}
            name="previousExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Have you previously been part of Thanima or any other
                  cultural/literary club? If yes, please specify your role.
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Your previous experience (if any)..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div
          className={cn(
            "space-y-6",
            currentStep === 2 ? "block animate-in fade-in-50" : "hidden"
          )}
        >
          <div className="space-y-4">
            {DEPARTMENT_DESCRIPTIONS.map((dept) => (
              <Card key={dept.name}>
                <CardHeader>
                  <CardTitle className="text-xl">{dept.name}</CardTitle>
                  <CardDescription>{dept.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="primaryPreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Department</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="secondaryPreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary Department</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem
                          key={dept}
                          value={dept}
                          disabled={dept === primaryPreference}
                          className={cn(
                            dept === primaryPreference &&
                              "text-muted-foreground/50"
                          )}
                        >
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div
          className={cn(
            "space-y-6",
            currentStep === 3 ? "block animate-in fade-in-50" : "hidden"
          )}
        >
          <FormField
            control={form.control}
            name="essay1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Why do you want to be a part of Thanima?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your motivation..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="essay2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Describe a time you worked in a team to overcome a challenge.
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the situation, your role, and the outcome..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="portfolioLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Portfolio/Work Samples Link (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://your-portfolio.com"
                    {...field}
                    className="font-code"
                  />
                </FormControl>
                <FormDescription className="font-code">
                  Link to your portfolio, GitHub, Behance, etc.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            onClick={prevStep}
            variant="secondary"
            className={cn(currentStep === 0 && "invisible")}
            disabled={isSubmitting}
          >
            <ArrowLeft />
            Back
          </Button>
          <Button
            type="button"
            onClick={nextStep}
            variant="default"
            className={cn(currentStep === 3 && "hidden")}
            disabled={isSubmitting}
          >
            Next
            <ArrowRight />
          </Button>
          <Button
            type="submit"
            variant="default"
            className={cn(currentStep !== 3 && "hidden")}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="animate-spin" />}
            Submit Application
          </Button>
        </div>
      </form>
    </Form>
  );
}
