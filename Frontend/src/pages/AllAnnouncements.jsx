import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardHeader,
} from "../components/ui/card";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/use-toast";
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
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const AllAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin, token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/announcements`
        );
        // Sort by most recent
        const sorted = res.data.sort(
          (a, b) => new Date(b.timeAndDate) - new Date(a.timeAndDate)
        );
        setAnnouncements(sorted);
      } catch (err) {
        console.error("Error fetching announcements:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

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
    <div className="min-h-screen bg-secondary">
      <Helmet>
        <title>All Announcements - Podalakur Ganesh</title>
        <meta name="description" content="View all news and updates." />
      </Helmet>
      <main className="container max-w-4xl py-12 md:py-16">
        <div className="flex justify-between items-center mb-8">
          <div className="text-left">
            <h1 className="font-display text-3xl font-bold md:text-4xl">
              All Announcements
            </h1>
            <p className="text-muted-foreground mt-1">
              The latest news and updates.
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
          <div className="text-center text-muted-foreground">
            Loading announcements...
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center text-muted-foreground py-16">
            No announcements have been made yet.
          </div>
        ) : (
          <div className="space-y-6">
            {announcements.map((a) => (
              <Card
                key={a._id}
                className="group transition-shadow hover:shadow-md"
              >
                <div className="flex justify-between items-start p-6">
                  <div>
                    <CardTitle>{a.title}</CardTitle>
                    <CardDescription className="mt-1">
                      Posted on:{" "}
                      {new Date(a.timeAndDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                    <CardContent className="p-0 mt-4 text-muted-foreground">
                      {a.description}
                    </CardContent>
                  </div>
                  {isAdmin && (
                    <div className="pl-4 flex-shrink-0">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure you want to delete this?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the announcement.
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
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AllAnnouncements;
