import { Button } from "@/components/ui/button";
import { ArrowRight, Instagram, Linkedin, Mail, Newspaper } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center text-center p-4">
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
      <div className="mt-8 flex flex-col items-center gap-4">
        <Button asChild size="lg">
          <Link href="/apply">
            Get Started
            <ArrowRight />
          </Link>
        </Button>
        <div className="flex items-center gap-4 pt-4">
          <Button asChild variant="ghost" size="icon">
            <Link
              href="https://www.instagram.com"
              target="_blank"
              aria-label="Instagram"
            >
              <Instagram />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon">
            <Link
              href="https://www.linkedin.com"
              target="_blank"
              aria-label="LinkedIn"
            >
              <Linkedin />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon">
            <Link href="mailto:example@example.com" aria-label="Email">
              <Mail />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
