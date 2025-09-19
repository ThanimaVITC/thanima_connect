
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
import ScrollAnimation from "@/components/scroll-animation";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center p-4 sm:p-6 lg:p-8">
      <ScrollAnimation />
      <section className="flex flex-col items-center justify-center text-center py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="mx-auto mb-8 flex h-48 w-48 md:h-56 md:w-56 lg:h-64 lg:w-64 items-center justify-center logo-container">
         <img src="/thanima logo.png" alt="Thanima Logo"  className="h-full w-full object-contain" />
      </div>

      <div className="content-backdrop">
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground text-overlay hero-title">
          Thanima Recruitment Hub
        </h1>
        <p className="mt-4 max-w-2xl text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground text-overlay hero-subtitle">
          Join the heart of our cultural and literary community. We are looking
          for passionate and dedicated students to join our various departments
          and make a difference.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 hero-cta">
          <Button asChild size="lg" className="button-glow interactive-element pulse-animation glow-effect">
            <Link href="/apply">
              Get Started
              <ArrowRight className="ml-2" />
            </Link>
          </Button>
          <div className="flex items-center gap-4 pt-4">
            <Button asChild variant="ghost" size="icon" className="social-icon interactive-element glow-effect">
              <Link
                href="https://www.instagram.com/thanimavitc/"
                target="_blank"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className="social-icon interactive-element glow-effect">
              <Link
                href="https://www.linkedin.com/company/thanima-literary-club/"
                target="_blank"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className="social-icon interactive-element glow-effect">
              <Link href="mailto:thanimamalayalamliteraryclub@gmail.com" aria-label="Email">
                <Mail size={24} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      </section>

      <section className="w-full max-w-6xl py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="mb-12 text-center content-backdrop">
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-overlay">
            Our Departments
          </h2>
          <p className="mt-2 text-base sm:text-lg lg:text-xl text-muted-foreground text-overlay">
            Find where you fit in.
          </p>
        </div>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {DEPARTMENT_DESCRIPTIONS.map((dept) => (
            <Card key={dept.name} className="h-full card-hover interactive-element glow-effect">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg sm:text-xl">{dept.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm sm:text-base">{dept.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="mb-12 text-center content-backdrop">
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-overlay">
            Gallery
          </h2>
          <p className="mt-2 text-base sm:text-lg lg:text-xl text-muted-foreground text-overlay">
            A glimpse into our world.
          </p>
        </div>
        
        {/* Awesome carousel gallery with auto-loop */}
        <div className="carousel-container">
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
                  <div className="gallery-item group fade-in-up stagger-1" data-scroll-trigger>
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover rounded-lg"
                      data-ai-hint={image.imageHint}
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
            <CarouselPrevious className="ml-12" />
            <CarouselNext className="mr-12" />
          </Carousel>
        </div>
      </section>
      <footer className="w-full border-t mt-12 sm:mt-16 lg:mt-20 py-6 sm:py-8 text-center text-sm sm:text-base text-muted-foreground content-backdrop">
        <p className="text-overlay">&copy; 2025 THANIMA. All rights reserved.</p>
      </footer>
    </main>
  );
}
