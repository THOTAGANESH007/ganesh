import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useAuth } from "../../hooks/useAuth";
import EventForm from "./EventForm";
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
import { Trash2, LoaderCircle, CalendarPlus, View } from "lucide-react";

const Events = () => {
  const { isAdmin, token } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/events`);
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
      toast({
        variant: "destructive",
        title: "Failed to load events",
        description: "Please try refreshing the page.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleEventAdded = (newEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents((prevEvents) => prevEvents.filter((e) => e._id !== id));
      toast({ title: "Success 🎉", description: "Event has been deleted." });
    } catch (err) {
      toast({
        title: "Error ❌",
        description: "Could not delete the event.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <section aria-labelledby="events" className="container py-16 md:py-24">
        <div className="flex flex-col gap-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2
              id="events"
              className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
            >
              Upcoming Events
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join us for our upcoming celebrations and cultural events.
            </p>
          </div>

          {isAdmin && <EventForm onEventAdded={handleEventAdded} />}

          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : events.length > 0 ? (
            <>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {events.slice(0, 3).map((event) => (
                  <Card
                    key={event._id}
                    className="group flex flex-col rounded-lg overflow-hidden shadow-elegant transition-all duration-300 hover:shadow-elegant-lg hover:-translate-y-1"
                  >
                    <div
                      className="relative aspect-video w-full overflow-hidden cursor-pointer"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <img
                        src={event.photo.url}
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
                                <AlertDialogTitle>
                                  Delete this event?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone.
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
                    <CardContent className="pt-0 flex-grow">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {event.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {events.length > 3 && (
                <div className="flex justify-center mt-8">
                  {/* --- UPDATED BUTTON --- */}
                  <Button size="lg" onClick={() => navigate("/all-events")}>
                    View All Events
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-muted-foreground py-16 border-2 border-dashed rounded-lg">
              <CalendarPlus className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-foreground">
                No upcoming events
              </h3>
              <p className="mt-1 text-sm">
                Please check back soon for new event schedules.
              </p>
            </div>
          )}
        </div>
      </section>

      {selectedEvent && (
        <ImageLightbox
          item={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  );
};

export default Events;
