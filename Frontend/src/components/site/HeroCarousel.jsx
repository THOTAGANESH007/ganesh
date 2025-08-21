import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Button } from "../ui/button";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import hero1 from "../../assets/ganesh-hero-1.jpg";
import hero2 from "../../assets/ganesh-hero-2.jpg";
import hero3 from "../../assets/ganesh-hero-3.jpg";

const heroImages = [
  {
    src: hero1,
    alt: "Lord Ganesha statue decorated with flowers and lights.",
    title: "Podalakur Ganesh",
    subtitle:
      "Celebrate Ganesh Chaturthi with devotion, culture, and community.",
  },
  {
    src: hero2,
    alt: "Ganesha idol in a vibrant street procession.",
    title: "Joyful Processions",
    subtitle: "Experience the energy and devotion of our grand processions.",
  },
  {
    src: hero3,
    alt: "Devotees praying with candles around a Ganesha idol at night.",
    title: "Community & Devotion",
    subtitle: "Join together in prayer, celebration, and spiritual upliftment.",
  },
];

const HeroCarousel = () => {
  const { user, logout } = useAuth();

  return (
    <header className="relative">
      <Carousel
        className="w-full"
        plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
        opts={{ loop: true }}
      >
        <CarouselContent>
          {heroImages.map((item, idx) => (
            <CarouselItem key={idx}>
              <div className="relative overflow-hidden aspect-[3/2] sm:aspect-[2/1] lg:aspect-[2.5/1]">
                <img
                  src={item.src}
                  alt={item.alt}
                  loading={idx === 0 ? "eager" : "lazy"}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 md:p-16 text-white">
                  <div className="max-w-3xl animate-enter">
                    <h1 className="font-display text-4xl font-bold leading-tight drop-shadow-lg md:text-6xl">
                      {item.title}
                    </h1>
                    <p className="mt-3 text-lg/relaxed drop-shadow-md md:text-xl max-w-2xl">
                      {item.subtitle}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button asChild variant="hero" size="lg">
                        <Link to="/all-media" aria-label="View media gallery">
                          View Gallery
                        </Link>
                      </Button>
                      {user ? (
                        <Button variant="secondary" size="lg" onClick={logout}>
                          Sign Out
                        </Button>
                      ) : (
                        <Button asChild variant="secondary" size="lg">
                          <Link to="/auth">Sign In</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className="left-4 backdrop-blur supports-[backdrop-filter]:bg-white/30"
          aria-label="Previous"
        />
        <CarouselNext
          className="right-4 backdrop-blur supports-[backdrop-filter]:bg-white/30"
          aria-label="Next"
        />
      </Carousel>
    </header>
  );
};

export default HeroCarousel;
