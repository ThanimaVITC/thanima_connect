"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Home,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
} from "lucide-react";

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
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";
import Link from "next/link";

const TOTAL_STEPS = 5;
const LOCAL_STORAGE_KEY = "thanima-application-submitted";

const AlreadyApplied = () => (
  <div className="py-8 text-center">
    <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />
    <h2 className="mt-4 font-headline text-2xl font-bold">
      Application Already Submitted!
    </h2>
    <p className="mt-2 text-muted-foreground">
      Thank you for your interest. We have already received an application from
      this browser.
    </p>
  </div>
);

export function ApplicationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState<boolean | null>(null);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const submitted = localStorage.getItem(LOCAL_STORAGE_KEY);
    setHasApplied(submitted === "true");
  }, []);

  const form = useForm<ApplicationData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "",
      regNo: "",
      branchAndYear: "",
      email: "",
      phone: "",
      previousExperience: "",
      primaryPreference: "" as any,
      secondaryPreference: "" as any,
      tertiaryPreference: "" as any,
      departmentJustification: "",
      skillsAndExperience: "",
      resume: undefined,
      bonusEssay1: "",
      bonusEssay2: "",
    },
    mode: "onTouched",
  });

  const primaryPreference = form.watch("primaryPreference");
  const secondaryPreference = form.watch("secondaryPreference");
  const tertiaryPreference = form.watch("tertiaryPreference");

  const processForm = async (data: ApplicationData) => {
    setIsSubmitting(true);
    
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'resume' && value instanceof File) {
          formData.append(key, value);
        } else if (key !== 'resume') {
          formData.append(key, value as string);
        }
      }
    });

    const result = await submitApplication(formData);

    if (result.success) {
      localStorage.setItem(LOCAL_STORAGE_KEY, "true");
      setCurrentStep(TOTAL_STEPS);
    } else {
      toast({
        title: "Submission Failed",
        description: result.error || "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  const nextStep = async () => {
    const fieldsPerStep: FieldPath<ApplicationData>[][] = [
      ["name", "regNo", "branchAndYear", "email", "phone"],
      ["previousExperience"],
      ["primaryPreference", "secondaryPreference", "tertiaryPreference"],
      [
        "departmentJustification",
        "skillsAndExperience",
        "resume",
      ],
      ["bonusEssay1", "bonusEssay2"],
    ];

    const output = await form.trigger(fieldsPerStep[currentStep], {
      shouldFocus: true,
    });

    if (!output) return;

    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      await form.handleSubmit(processForm)();
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  if (hasApplied === null) {
    return (
      <div className="space-y-4 p-8">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (hasApplied) {
    return <AlreadyApplied />;
  }

  if (currentStep === TOTAL_STEPS) {
    return (
        <div className="py-8 text-center animate-in fade-in-50 duration-500">
        <div className="mx-auto flex h-20 w-20 items-center justify-center mb-4">
          <img src="/logo 2.png" alt="Thanima Logo" className="h-full w-full object-contain" />
        </div>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-10 w-10 text-primary animate-in zoom-in-50" />
        </div>
        <h2 className="mt-4 font-headline text-2xl font-bold">
          Application Submitted!
        </h2>
        <p className="mt-2 text-muted-foreground">
          Thank you for your interest in joining Thanima. We have received your
          application and will be in touch shortly.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4">
          <Button asChild>
            <Link href="/">
              <Home />
              Go to Homepage
            </Link>
          </Button>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link
                href="https://www.instagram.com/thanimavitc/"
                target="_blank"
                aria-label="Instagram"
              >
                <Instagram />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon">
              <Link
                href="https://www.linkedin.com/company/thanima-literary-club/"
                target="_blank"
                aria-label="LinkedIn"
              >
                <Linkedin />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon">
              <Link href="mailto:thanimamalayalamliteraryclub@gmail.com" aria-label="Email">
                <Mail />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-8">
        <Progress
          value={((currentStep + 1) / TOTAL_STEPS) * 100}
          className="mb-8"
        />
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
                  cultural/literary club? If yes, please specify your role and club name.
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
            <FormField
              control={form.control}
              name="tertiaryPreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tertiary Department</FormLabel>
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
                          disabled={dept === primaryPreference || dept === secondaryPreference}
                          className={cn(
                            (dept === primaryPreference || dept === secondaryPreference) &&
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
          <div className="space-y-2">
            <FormLabel>You have selected:</FormLabel>
            <div className="flex flex-wrap gap-2">
              {primaryPreference && (
                <Badge variant="secondary">1: {primaryPreference}</Badge>
              )}
              {secondaryPreference && (
                <Badge variant="secondary">2: {secondaryPreference}</Badge>
              )}
              {tertiaryPreference && (
                <Badge variant="secondary">3: {tertiaryPreference}</Badge>
              )}
            </div>
          </div>
          <FormField
            control={form.control}
            name="departmentJustification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Why have you chosen these departments?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us your reasons..."
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
            name="skillsAndExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  What skills, prior experience, or qualities make you suitable
                  for these departments?
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your skills and experience..."
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
            name="resume"
            render={({ field: { onChange, value, ...rest } }) => (
              <FormItem>
                <FormLabel>Upload a file (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mov,.avi"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      onChange(file);
                    }}
                    {...rest}
                  />
                </FormControl>
                <FormDescription>
                  File Upload (Limit to: Docs, PDFs, Images, Videos. Max size: 10 MB)
                  <br />
                  You may share any supporting material that highlights your skills or interest, such as:
                  <br />• poem/story/artwork/poster you made
                  <br />• An event you helped organize
                  <br />• A photo/video that represents you
                  <br />• Even a fun meme you created!
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div
          className={cn(
            "space-y-6",
            currentStep === 4 ? "block animate-in fade-in-50" : "hidden"
          )}
        >
          <FormField
            control={form.control}
            name="bonusEssay1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  If you had to describe about one malayalam movie, what would
                  it be and why? (Optional)
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about the movie..."
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
            name="bonusEssay2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  What’s one unforgettable memory or cultural tradition from
                  Kerala that inspires you? (Optional)
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the memory or tradition..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
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
            className={cn(currentStep === 0 && "invisible", "button-glow interactive-element")}
            disabled={isSubmitting}
          >
            <ArrowLeft />
            Back
          </Button>
          <Button
            type="submit"
            variant="default"
            className="button-glow interactive-element pulse-animation glow-effect"
            disabled={isSubmitting}
          >
            {currentStep === TOTAL_STEPS - 1 ? (
              isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Submit Application"
              )
            ) : (
              <>
                Next
                <ArrowRight />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
