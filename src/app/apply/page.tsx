import {ApplicationForm} from '@/components/application-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Newspaper} from 'lucide-react';

export default function ApplyPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-2xl">
        <Card className="border-2 border-primary/20 shadow-lg dark:shadow-primary/10">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Newspaper className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl tracking-tight">
              Thanima Recruitment Portal
            </CardTitle>
            <CardDescription className="pt-2">
              Join our team and be a part of something special. Please fill out
              the form below to apply.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApplicationForm />
          </CardContent>
        </Card>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Developed by Thanima Team
        </p>
      </div>
    </main>
  );
}
