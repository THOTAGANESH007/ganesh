import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const MediaPage = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/media`
        );
        setMediaItems(data || []);
      } catch (err) {
        console.error("Error fetching media:", err);
        setError("Failed to load media. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, []);

  return (
    <div className="min-h-screen bg-secondary">
      <Helmet>
        <title>Media Gallery - Podalakur Ganesh</title>
        <meta
          name="description"
          content="A collection of photos from our festivities."
        />
      </Helmet>

      <main className="container max-w-7xl py-12 md:py-16">
        <div className="flex justify-between items-center mb-8">
          <div className="text-left">
            <h1 className="font-display text-3xl font-bold md:text-4xl">
              Media Gallery
            </h1>
            <p className="text-muted-foreground mt-1">
              A collection of photos from our festivities.
            </p>
          </div>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        ) : error ? (
          <div className="text-center text-destructive">{error}</div>
        ) : mediaItems.length === 0 ? (
          <div className="text-center text-muted-foreground py-16">
            No media has been uploaded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {mediaItems.map((item) => (
              <Card
                key={item._id}
                className="group rounded-lg overflow-hidden shadow-elegant transition-shadow hover:shadow-elegant-lg"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={item.photo?.url || "/placeholder-image.png"}
                    alt={item.photo?.alt || item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <CardHeader>
                  <CardTitle>{item.title || "Untitled"}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {item.description || "No description"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MediaPage;
