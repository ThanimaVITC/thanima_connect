import { Button } from "@/components/ui/button";
import { ArrowRight, Newspaper } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center text-center">
      <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Newspaper className="h-10 w-10 text-primary" />
      </div>
      <h1 className="font-headline text-5xl font-bold tracking-tight text-foreground md:text-6xl">
        Thanima Recruitment Hub
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
        Join the heart of our cultural and literary community. We are looking for
        passionate and dedicated students to join our various departments and
        make a difference.
      </p>
      <Button asChild size="lg" className="mt-8">
        <Link href="/apply">
          Get Started
          <ArrowRight />
        </Link>
      </Button>
    </main>
  );
}
