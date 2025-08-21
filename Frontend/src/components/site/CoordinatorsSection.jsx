import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "../../hooks/useAuth";
import CoordinatorForm from "./CoordinatorForm";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
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
import { Trash2, LoaderCircle } from "lucide-react";

const initials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const CoordinatorsSection = () => {
  const { isAdmin, token } = useAuth();
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    const fetchCoordinators = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/coordinators`
        );
        if (isMounted) {
          setCoordinators(res.data);
        }
      } catch (err) {
        console.error("Error fetching coordinators:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchCoordinators();

    return () => {
      isMounted = false;
    };
  }, []); // Fetch only once on mount

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
    <section
      aria-labelledby="coordinators"
      className="bg-secondary py-16 md:py-24"
    >
      <div className="container">
        <div className="flex flex-col items-center text-center gap-12">
          <div className="max-w-3xl">
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
          </div>

          {isAdmin && (
            <div className="w-full flex justify-center">
              <CoordinatorForm />
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center mt-12 min-h-[200px]">
            <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : coordinators.length > 0 ? (
          <>
            <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 xl:gap-x-8">
              {coordinators.slice(0, 5).map((c) => (
                <div key={c._id} className="group relative text-center">
                  <div className="transform transition-all duration-300 group-hover:scale-105">
                    <Avatar className="h-28 w-28 mx-auto border-4 border-background shadow-lg group-hover:ring-4 group-hover:ring-primary/50 transition-all">
                      <AvatarImage
                        src={c.photo.url}
                        alt={c.photo.alt}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-3xl bg-secondary text-secondary-foreground">
                        {initials(c.name)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="mt-4 text-base font-semibold text-foreground">
                      {c.name}
                    </h3>
                  </div>

                  {isAdmin && (
                    <div className="absolute -top-2 -right-2">
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
                              Delete this coordinator?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete {c.name} and their
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
                </div>
              ))}
            </div>

            {coordinators.length > 5 && (
              <div className="mt-16 flex justify-center">
                {/* --- UPDATED BUTTON --- */}
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
