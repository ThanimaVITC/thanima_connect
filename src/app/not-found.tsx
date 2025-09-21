import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="content-backdrop text-center">
        <h1 className="font-headline text-8xl sm:text-9xl font-bold text-primary">
          404
        </h1>
        <h2 className="mt-4 font-headline text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground">
          Page Not Found
        </h2>
        <p className="mt-4 max-w-md text-base sm:text-lg text-muted-foreground">
          Oops! The page you are looking for does not exist. It might have been
          moved or deleted.
        </p>
        <div className="mt-8">
          <Button asChild size="lg" className="button-glow interactive-element">
            <Link href="/">
              <ArrowLeft className="mr-2" />
              Go Back Home
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
