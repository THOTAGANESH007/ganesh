import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { Button } from "../components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/use-toast";
import ImageLightbox from "../components/site/ImageLightbox";
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
} from "../components/ui/alert-dialog";
import { Trash2, View, LoaderCircle, CameraOff, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AllMedia = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const { isAdmin, token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/media`
        );
        setMediaItems(data || []);
      } catch (err) {
        setError("Failed to load media. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/media/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMediaItems((prev) => prev.filter((item) => item._id !== id));
      toast({
        title: "Success 🎉",
        description: "Media item has been deleted.",
      });
    } catch (err) {
      toast({
        title: "Error ❌",
        description: "Could not delete the media item.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background">
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
            <Button asChild variant="outline">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
          {loading ? (
            <div className="flex justify-center items-center min-h-[40vh]">
              <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center text-destructive">{error}</div>
          ) : mediaItems.length === 0 ? (
            <div className="text-center text-muted-foreground py-16 border-2 border-dashed rounded-lg">
              <CameraOff className="mx-auto h-12 w-12" />
              <h3 className="mt-2 text-sm font-semibold text-foreground">
                No Media Found
              </h3>
              <p className="mt-1 text-sm">
                No photos have been uploaded to the gallery yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mediaItems.map((item) => (
                <div key={item._id} className="group relative">
                  <div
                    className="aspect-video w-full overflow-hidden rounded-lg shadow-elegant cursor-pointer"
                    onClick={() => setSelectedMedia(item)}
                  >
                    <img
                      src={item.photo?.url || "/placeholder-image.png"}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the media item.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(item._id)}
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
          )}
        </main>
      </div>

      {selectedMedia && (
        <ImageLightbox
          item={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </>
  );
};

export default AllMedia;
