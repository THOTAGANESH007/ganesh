import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
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
import { Trash2, View, LoaderCircle, CalendarPlus } from "lucide-react";
import { Link } from "react-router-dom";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { isAdmin, token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/events`
        );
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents((prev) => prev.filter((e) => e._id !== id));
      toast({ title: "Success", description: "Event deleted successfully." });
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not delete the event.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-secondary">
        <Helmet>
          <title>All Events - Podalakur Ganesh</title>
          <meta
            name="description"
            content="View all of our upcoming events and celebrations."
          />
        </Helmet>
        <main className="container max-w-7xl py-12 md:py-16">
          <div className="flex justify-between items-center mb-8">
            <div className="text-left">
              <h1 className="font-display text-3xl font-bold md:text-4xl">
                All Events
              </h1>
              <p className="text-muted-foreground mt-1">
                Our upcoming events and celebrations.
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
          ) : events.length === 0 ? (
            <div className="text-center text-muted-foreground py-16 border-2 border-dashed rounded-lg">
              <CalendarPlus className="mx-auto h-12 w-12" />
              <h3 className="mt-2 text-sm font-semibold text-foreground">
                No Events Scheduled
              </h3>
              <p className="mt-1 text-sm">
                There are no events scheduled at this time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card
                  key={event._id}
                  className="group flex flex-col rounded-lg overflow-hidden shadow-elegant transition-all duration-300 hover:shadow-elegant-lg hover:-translate-y-1"
                >
                  <div
                    className="relative aspect-video w-full overflow-hidden cursor-pointer"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <img
                      src={event.photo?.url || "/placeholder-image.png"}
                      alt={event.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <View className="h-10 w-10 text-white" />
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
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the event and its
                                photo. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(event._id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {event.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      {selectedEvent && (
        <ImageLightbox
          item={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  );
};

export default AllEvents;
