import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { useAuth } from "../../hooks/useAuth";
import AnnouncementForm from "./AnnouncementForm";
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
import { Trash2, CalendarDays, LoaderCircle, Megaphone } from "lucide-react";

const Announcements = () => {
  const { isAdmin, token } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/announcements`
      );
      // Sort announcements by date, most recent first
      const sorted = res.data.sort(
        (a, b) => new Date(b.timeAndDate) - new Date(a.timeAndDate)
      );
      setAnnouncements(sorted);
    } catch (err) {
      console.error("Error fetching announcements:", err);
      toast({
        variant: "destructive",
        title: "Failed to load announcements",
        description: "Please try refreshing the page.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleAnnouncementAdded = (newAnnouncement) => {
    // Add the new announcement to the top of the list and re-sort
    setAnnouncements((prev) =>
      [newAnnouncement, ...prev].sort(
        (a, b) => new Date(b.timeAndDate) - new Date(a.timeAndDate)
      )
    );
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/announcements/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAnnouncements((prev) => prev.filter((a) => a._id !== id));
      toast({ title: "Success", description: "Announcement deleted." });
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not delete announcement.",
        variant: "destructive",
      });
    }
  };

  return (
    <section
      aria-labelledby="announcements"
      className="container py-16 md:py-24"
    >
      <div className="flex flex-col gap-12">
        <div className="text-center max-w-3xl mx-auto">
          <h2
            id="announcements"
            className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
          >
            Latest Announcements
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Stay updated with the latest news and updates from our team.
          </p>
        </div>

        {isAdmin && (
          <AnnouncementForm onAnnouncementAdded={handleAnnouncementAdded} />
        )}

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : announcements.length > 0 ? (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {announcements.slice(0, 3).map((a) => (
                <article key={a._id} className="group relative flex flex-col">
                  <Card className="flex-grow transition-all duration-300 hover:shadow-elegant-lg hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex justify-between items-start gap-4">
                        <CardTitle className="text-lg md:text-xl">
                          {a.title}
                        </CardTitle>
                        <Badge variant="secondary">New</Badge>
                      </div>
                      <time
                        dateTime={a.timeAndDate}
                        className="mt-2 flex items-center gap-2 text-xs font-medium text-muted-foreground"
                      >
                        <CalendarDays className="h-4 w-4" />
                        {new Date(a.timeAndDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </CardHeader>
                    <CardContent className="pt-0 text-sm text-muted-foreground">
                      <p className="line-clamp-4">{a.description}</p>
                    </CardContent>
                  </Card>
                  {isAdmin && (
                    <div className="absolute top-3 right-3">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete this announcement?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(a._id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </article>
              ))}
            </div>
            {announcements.length > 3 && (
              <div className="flex justify-center mt-8">
                {/* --- UPDATED BUTTON --- */}
                <Button
                  size="lg"
                  onClick={() => navigate("/all-announcements")}
                >
                  View All Announcements
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-muted-foreground py-16 border-2 border-dashed rounded-lg">
            <Megaphone className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-foreground">
              No announcements yet
            </h3>
            <p className="mt-1 text-sm">Check back later for new updates.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Announcements;
