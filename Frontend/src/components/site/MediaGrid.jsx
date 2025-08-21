import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "../ui/card";
import { LoaderCircle, CameraOff } from "lucide-react";

const MediaGrid = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/media`
        );
        setMedia(res.data);
      } catch (err) {
        console.error("Failed to fetch media:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-16 border-2 border-dashed rounded-lg col-span-full">
        <CameraOff className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-foreground">
          No media found
        </h3>
        <p className="mt-1 text-sm">There are no photos in the gallery yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {media.map((m) => (
        <Card
          key={m._id}
          className="group relative block w-full overflow-hidden rounded-lg shadow-elegant transition-shadow hover:shadow-elegant-lg"
        >
          {m.photo?.url && (
            <div className="aspect-[16/10]">
              <img
                src={m.photo.url}
                alt={m.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <h3 className="text-xl font-bold text-white">{m.title}</h3>
            <p className="text-sm text-slate-300 line-clamp-2">
              {m.description}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MediaGrid;
