import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
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

const initials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const AllCoordinators = () => {
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin, token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCoordinators = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/coordinators`
        );
        setCoordinators(res.data);
      } catch (err) {
        console.error("Error fetching coordinators:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoordinators();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/coordinators/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCoordinators((prev) => prev.filter((c) => c._id !== id));
      toast({ title: "Success", description: "Coordinator deleted." });
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not delete coordinator.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-secondary">
      <Helmet>
        <title>All Coordinators - Podalakur Ganesh</title>
        <meta
          name="description"
          content="Meet the dedicated team behind Podalakur Ganesh."
        />
      </Helmet>
      <main className="container max-w-5xl py-12 md:py-16">
        <div className="flex justify-between items-center mb-8">
          <div className="text-left">
            <h1 className="font-display text-3xl font-bold md:text-4xl">
              Our Coordinators
            </h1>
            <p className="text-muted-foreground mt-1">
              The dedicated team behind Podalakur Ganesh.
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
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {coordinators.map((c) => (
              <div
                key={c._id}
                className="group relative flex flex-col items-center text-center"
              >
                <Avatar className="h-28 w-28 border-4 border-background shadow-lg transition-all group-hover:ring-4 group-hover:ring-primary/50">
                  <AvatarImage
                    src={c.photo.url}
                    alt={c.photo.alt}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-3xl">
                    {initials(c.name)}
                  </AvatarFallback>
                </Avatar>
                <p className="mt-4 font-semibold">{c.name}</p>
                {isAdmin && (
                  <div className="absolute top-0 right-0">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete {c.name}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete this coordinator. This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(c._id)}
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
  );
};

export default AllCoordinators;
