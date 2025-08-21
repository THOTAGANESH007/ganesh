import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import MediaForm from "./MediaForm";
import ImageLightbox from "./ImageLightbox";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useToast } from "../../hooks/use-toast";
import { ChevronRight } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Trash2, LoaderCircle, CameraOff, View } from "lucide-react";

const MediaSection = () => {
  const { isAdmin, token } = useAuth();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/media`);
      setMedia(res.data);
    } catch (err) {
      console.error("Failed to fetch media:", err);
      toast({
        variant: "destructive",
        title: "Failed to load media",
        description: "Please try refreshing the page.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleMediaAdded = (newMedia) => {
    setMedia((prev) => [newMedia, ...prev]);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/media/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedia((prevMedia) => prevMedia.filter((m) => m._id !== id));
      toast({ title: "Success", description: "Media item deleted." });
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not delete media item.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <section aria-labelledby="media" className="container py-16 md:py-24">
        <div className="flex flex-col gap-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2
              id="media"
              className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
            >
              Media Gallery
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Browse photos from our celebrations and cherished moments.
            </p>
          </div>

          {isAdmin && <MediaForm onMediaAdded={handleMediaAdded} />}

          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : media.length > 0 ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {media.slice(0, 3).map((m) => (
                  <div key={m._id} className="group relative">
                    <div
                      className="aspect-video w-full overflow-hidden rounded-lg shadow-elegant cursor-pointer"
                      onClick={() => setSelectedMedia(m)}
                    >
                      <img
                        src={m.photo.url}
                        alt={m.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                        <View className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    {isAdmin && (
                      <div
                        className="absolute top-2 right-2 z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete this media item?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(m._id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {media.length > 3 && (
                <div className="flex justify-center mt-8">
                  {/* --- UPDATED BUTTON --- */}
                  <Button size="lg" onClick={() => navigate("/all-media")}>
                    View Full Gallery
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-muted-foreground py-16 border-2 border-dashed rounded-lg">
              <CameraOff className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-foreground">
                No media uploaded
              </h3>
              <p className="mt-1 text-sm">
                Check back later to see photos from our events.
              </p>
            </div>
          )}
        </div>
      </section>

      {selectedMedia && (
        <ImageLightbox
          item={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </>
  );
};

export default MediaSection;
