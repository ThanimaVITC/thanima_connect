
import { Button } from "@/components/ui/button";
import { ArrowRight, Instagram, Linkedin, Mail, Newspaper } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DEPARTMENT_DESCRIPTIONS } from '@/lib/constants';
import Image from 'next/image';
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center p-4">
      <section className="flex flex-col items-center justify-center text-center py-16 md:py-24">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Newspaper className="h-10 w-10 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold tracking-tight text-foreground md:text-6xl">
          Thanima Recruitment Hub
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Join the heart of our cultural and literary community. We are looking
          for passionate and dedicated students to join our various departments
          and make a difference.
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
      </section>

      <section className="w-full max-w-6xl py-16 md:py-24">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-4xl font-bold tracking-tight text-foreground">
            Our Departments
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Find where you fit in.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {DEPARTMENT_DESCRIPTIONS.map((dept) => (
            <Card key={dept.name} className="h-full">
              <CardHeader>
                <CardTitle>{dept.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{dept.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="w-full max-w-6xl py-16 md:py-24">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-4xl font-bold tracking-tight text-foreground">
            Gallery
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            A glimpse into our world.
          </p>
        </div>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {PlaceHolderImages.map((image, index) => (
              <CarouselItem
                key={index}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-1">
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative h-64 w-full">
                        <Image
                          src={image.imageUrl}
                          alt={image.description}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                          data-ai-hint={image.imageHint}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-12" />
          <CarouselNext className="mr-12" />
        </Carousel>
      </section>
      <footer className="w-full border-t mt-16 py-8 text-center text-sm text-muted-foreground">
        <p>&copy; 2025 THANIMA. All rights reserved.</p>
      </footer>
    </main>
  );
}
