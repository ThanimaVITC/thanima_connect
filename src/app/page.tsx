import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col">
      <div className="flex-1">
        <section className="relative h-[60vh] w-full">
          <Image
            src="https://picsum.photos/seed/1/1200/800"
            alt="Thanima header image"
            fill
            className="object-cover"
            data-ai-hint="culture festival"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="relative flex h-full flex-col items-center justify-center text-center text-primary-foreground">
            <div className="rounded-lg bg-black/50 p-8 shadow-2xl backdrop-blur-sm">
              <h1 className="font-headline text-5xl font-bold tracking-tight md:text-7xl">
                Thanima
              </h1>
              <p className="mt-4 max-w-2xl text-lg md:text-xl">
                The Malayalam Literacy Association of VIT Chennai
              </p>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto max-w-4xl px-4 text-center md:px-6">
            <h2 className="font-headline text-3xl font-bold tracking-tighter text-primary sm:text-5xl">
              About Thanima
            </h2>
            <div className="mx-auto mt-6">
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Thanima is the official Malayalam literacy association of Vellore
                Institute of Technology, Chennai. We are a vibrant community of
                students dedicated to promoting and celebrating the richness of
                Malayalam language, literature, and culture. Join us to be a
                part of our exciting events, workshops, and activities.
              </p>
            </div>
            <Button asChild size="lg" className="mt-8" style={{ backgroundColor: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))"}}>
              <Link href="/apply">
                Join Us
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>
      </div>
      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground md:px-6">
          <p>Powered by Creativity</p>
        </div>
      </footer>
    </main>
  );
}