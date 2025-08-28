import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/use-toast";

import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
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
import { ArrowLeft, Trash2 } from "lucide-react";

// Utility → get initials
const initials = (name) =>
  name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const AllCoordinators = () => {
  const { isAdmin, token } = useAuth();
  const { toast } = useToast();

  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch coordinators
  useEffect(() => {
    const fetchCoordinators = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/coordinators`
        );
        setCoordinators(res.data || []);
      } catch (err) {
        console.error("Error fetching coordinators:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoordinators();
  }, []);

  // Delete coordinator
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/coordinators/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCoordinators((prev) => prev.filter((c) => c._id !== id));
      toast({ title: "Success", description: "Coordinator deleted." });
    } catch {
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
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div>
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
        </motion.div>

        {/* Loader */}
        {loading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.06, delayChildren: 0.05 },
              },
            }}
          >
            {coordinators.map((c) => (
              <motion.div
                key={c._id}
                className="group relative flex flex-col items-center p-5 rounded-2xl bg-background shadow-sm border border-border text-center transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/30"
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
                }}
              >
                <Avatar className="h-28 w-28 border-4 border-background shadow-lg transition-all duration-300 group-hover:ring-4 group-hover:ring-primary/40">
                  <AvatarImage
                    src={c?.photo?.url}
                    alt={c?.photo?.alt || c?.name || "Coordinator"}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-3xl">
                    {initials(c?.name)}
                  </AvatarFallback>
                </Avatar>

                <p className="mt-4 font-semibold">{c?.name}</p>

                {/* Delete button (Admin only) */}
                {isAdmin && (
                  <div className="absolute top-3 right-3">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8 rounded-full opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete {c?.name}?</AlertDialogTitle>
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
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AllCoordinators;
