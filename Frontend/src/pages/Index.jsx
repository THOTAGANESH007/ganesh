import { Helmet } from "react-helmet-async";
import HeroCarousel from "../components/site/HeroCarousel";
import MediaSection from "../components/site/MediaSection";
import Announcements from "../components/site/Announcements";
import Events from "../components/site/Events";
import CoordinatorsSection from "../components/site/CoordinatorsSection";
import { Link } from "react-router-dom";
import { Twitter, Instagram, Facebook, Youtube } from "lucide-react";

// Helper component for the wave divider
const WaveDivider = ({ className = "" }) => (
  <div className={`bg-secondary ${className}`}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
      <path
        fill="hsl(var(--background))"
        fillOpacity="1"
        d="M0,32L48,53.3C96,75,192,117,288,117.3C384,117,480,75,576,58.7C672,43,768,53,864,80C960,107,1056,149,1152,149.3C1248,149,1344,107,1392,85.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
      ></path>
    </svg>
  </div>
);

// Helper component for the curved divider
const CurvedDivider = ({ className = "" }) => (
  <div className={`bg-background ${className}`}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
      <path
        fill="hsl(var(--secondary))"
        fillOpacity="1"
        d="M0,64L80,90.7C160,117,320,171,480,181.3C640,192,800,160,960,138.7C1120,117,1280,107,1360,101.3L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
      ></path>
    </svg>
  </div>
);

const Index = () => {
  const canonical = typeof window !== "undefined" ? window.location.href : "/";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Podalakur Ganesh Chaturthi Festival",
    url: canonical,
    description:
      "Celebrate Ganesh Chaturthi with events, media gallery, and community at Podalakur Ganesh.",
    organizer: {
      "@type": "Organization",
      name: "Podalakur Ganesh Committee",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Podalakur Ganesh | Ganesh Chaturthi Festival</title>
        <meta
          name="description"
          content="Celebrate Ganesh Chaturthi with events, media gallery, and coordinators from Podalakur Ganesh."
        />
        <link rel="canonical" href={canonical} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <HeroCarousel />

      <main>
        <Announcements />
        <WaveDivider />
        <div className="bg-secondary">
          <Events />
        </div>
        <CurvedDivider />
        <MediaSection />
        <CoordinatorsSection />
      </main>

      {/* --- START OF CORRECTED DARK FOOTER --- */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="container py-12 md:py-16">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4 lg:col-span-5">
              <h3 className="font-display text-2xl font-semibold text-primary">
                Podalakur Ganesh
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Celebrating tradition, community, and devotion. Join us in our
                next festival!
              </p>
              <div className="mt-4 flex space-x-4">
                <a
                  href="#"
                  className="text-slate-400 hover:text-primary transition-colors"
                >
                  <Twitter />
                </a>
                <a
                  href="https://www.instagram.com/bharath_sp05?igsh=MWRhcHRzeW1ydGdsYQ=="
                  className="text-slate-400 hover:text-primary transition-colors"
                >
                  <Instagram />
                </a>
                <a
                  href="#"
                  className="text-slate-400 hover:text-primary transition-colors"
                >
                  <Facebook />
                </a>
                <a
                  href="#"
                  className="text-slate-400 hover:text-primary transition-colors"
                >
                  <Youtube />
                </a>
              </div>
            </div>

            <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div className="sm:col-start-2">
                <h3 className="font-semibold tracking-wider uppercase text-slate-400">
                  Quick Links
                </h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link
                      to="/all-announcements"
                      className="text-slate-300 hover:text-primary transition-colors"
                    >
                      Announcements
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/all-events"
                      className="text-slate-300 hover:text-primary transition-colors"
                    >
                      Events
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/all-media"
                      className="text-slate-300 hover:text-primary transition-colors"
                    >
                      Gallery
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/all-coordinators"
                      className="text-slate-300 hover:text-primary transition-colors"
                    >
                      Our Team
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold tracking-wider uppercase text-slate-400">
                  Contact
                </h3>
                <address className="mt-4 space-y-2 text-sm text-slate-300 not-italic">
                  <p>SOMA PENCHALA BHARATH (Admin)</p>
                  <p>
                    Phone:{" "}
                    <a
                      href="tel:+918978379001"
                      className="hover:text-primary transition-colors"
                    >
                      +91-8978379001
                    </a>
                  </p>
                  <p>
                    Email:{" "}
                    <a
                      href="mailto:spbharath2005@gmail.com"
                      className="hover:text-primary transition-colors"
                    >
                      spbharath2005@gmail.com
                    </a>
                  </p>
                </address>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
            <p>
              © {new Date().getFullYear()} Podalakur Ganesh Committee. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
      {/* --- END OF CORRECTED DARK FOOTER --- */}
    </div>
  );
};

export default Index;
