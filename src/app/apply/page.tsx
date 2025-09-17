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
    <main className="flex min-h-dvh flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl">
        <div className="content-backdrop">
          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center">
              <img src="/logo 2.png" alt="Thanima Logo" className="h-full w-full object-contain" />
            </div>
              <CardTitle className="font-headline text-3xl sm:text-4xl tracking-tight text-overlay hero-title">
                Thanima Recruitment Portal
              </CardTitle>
              <CardDescription className="pt-4 text-base sm:text-lg text-overlay hero-subtitle">
                Join our team and be a part of something special. Please fill out
                the form below to apply.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApplicationForm />
            </CardContent>
          </Card>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground text-overlay">
          Developed by Thanima Team
        </p>
      </div>
    </main>
  );
}
