import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
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
import { ArrowLeft, LoaderCircle, Megaphone, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const AllAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        setError("Failed to load announcements. Please try again later.");
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
      toast({
        title: "Success 🎉",
        description: "The announcement has been deleted.",
      });
    } catch (err) {
      toast({
        title: "Error ❌",
        description: "Could not delete the announcement.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>All Announcements - Podalakur Ganesh</title>
        <meta name="description" content="View all news and updates." />
      </Helmet>

      {/* Integrated Dark Header Section */}
      <header className="bg-[#0F172A] text-white shadow-md">
        <div className="container mx-auto max-w-7xl py-10 md:py-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="text-left">
              <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
                All Announcements
              </h1>
              <p className="mt-2 text-lg text-slate-300">
                The latest news and updates from our community.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Button
                asChild
                variant="outline"
                className="border-slate-500 bg-transparent text-slate-300 hover:border-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content section with its own background and padding */}
      <div className="bg-secondary">
        <main className="container max-w-5xl py-12 md:py-16">
          <div className="mx-auto w-full max-w-3xl">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="py-16 text-center text-destructive">{error}</div>
            ) : announcements.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed py-16 text-center text-muted-foreground">
                <Megaphone className="mx-auto h-12 w-12" />
                <h3 className="mt-2 text-sm font-semibold text-foreground">
                  No Announcements Yet
                </h3>
                <p className="mt-1 text-sm">
                  Check back later for news and updates.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {announcements.map((a) => (
                  <Card
                    key={a._id}
                    className="group transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between p-6">
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
                        <div className="flex-shrink-0 pl-4">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="icon"
                                className="h-9 w-9 opacity-0 transition-opacity group-hover:opacity-100"
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
          </div>
        </main>
      </div>
    </>
  );
};

export default AllAnnouncements;
