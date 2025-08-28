import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/use-toast";

import CoordinatorForm from "./CoordinatorForm";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
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
import { ChevronRight, Trash2, LoaderCircle } from "lucide-react";

// Utility → get initials for AvatarFallback
const initials = (name) =>
  name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const CoordinatorsSection = () => {
  const { isAdmin, token } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch coordinators
  useEffect(() => {
    let isMounted = true;

    const fetchCoordinators = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/coordinators`
        );
        if (isMounted) setCoordinators(res.data || []);
      } catch (err) {
        console.error("Error fetching coordinators:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCoordinators();
    return () => {
      isMounted = false;
    };
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
    <section
      aria-labelledby="coordinators"
      className="bg-secondary py-16 md:py-24"
    >
      <div className="container">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-12">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2
              id="coordinators"
              className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
            >
              Our Coordinators
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The dedicated team behind Podalakur Ganesh, working tirelessly to
              make every celebration a success.
            </p>
          </motion.div>

          {/* Add form (Admin only) */}
          {isAdmin && (
            <motion.div
              className="w-full max-w-lg mx-auto"
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35 }}
            >
              <Card className="bg-background/50 backdrop-blur-sm border-primary/20 shadow-sm">
                <CardHeader>
                  <CardTitle>Add New Coordinator</CardTitle>
                </CardHeader>
                <CardContent>
                  <CoordinatorForm />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center mt-12 min-h-[200px]">
            <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : coordinators.length > 0 ? (
          <>
            {/* Coordinators grid */}
            <div className="mt-20 flex flex-wrap justify-center items-start gap-x-12 gap-y-16 md:gap-x-24">
              {coordinators.slice(0, 3).map((c, idx) => (
                <motion.div
                  key={c._id}
                  className="group relative flex flex-col items-center w-56 p-6 rounded-2xl bg-background shadow-sm border border-border transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/30"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                >
                  <Avatar className="h-28 w-28 border-4 border-background shadow-lg transition-all duration-300 group-hover:ring-4 group-hover:ring-primary/40">
                    <AvatarImage
                      src={c?.photo?.url}
                      alt={c?.photo?.alt || c?.name || "Coordinator"}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-3xl bg-secondary text-secondary-foreground">
                      {initials(c?.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      {c?.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">Coordinator</p>
                  </div>

                  {/* Delete button (Admin only) */}
                  {isAdmin && (
                    <div className="absolute top-3 right-3">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-9 w-9 rounded-full opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete this coordinator?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete {c?.name} and their
                              photo.
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
            </div>

            {/* View All */}
            {coordinators.length > 3 && (
              <div className="mt-16 flex justify-center">
                <Button size="lg" onClick={() => navigate("/all-coordinators")}>
                  View All Coordinators
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          !isAdmin && (
            <p className="text-center text-muted-foreground mt-12">
              Coordinator information is not available at the moment.
            </p>
          )
        )}
      </div>
    </section>
  );
};

export default CoordinatorsSection;
