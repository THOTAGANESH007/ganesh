import { useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../../hooks/use-toast";
import { useAuth } from "../../hooks/useAuth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { LoaderCircle, UserPlus } from "lucide-react";

const CoordinatorForm = () => {
  const { toast } = useToast();
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !photo) {
      toast({
        title: "Missing fields",
        description: "Name and photo are required.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("photo", photo);

    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/coordinators`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast({
        title: "Coordinator Added 🎉",
        description: `“${res.data.coordinator.name}” has been added.`,
      });
      setName("");
      setPhoto(null);
      window.location.reload();
    } catch (err) {
      toast({
        title: "Upload failed ❌",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-elegant">
      <CardHeader>
        <CardTitle>Add New Coordinator</CardTitle>
        <CardDescription>
          Upload their name and photo to add them to the team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Coordinator's full name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="photo">Photo</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Coordinator
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CoordinatorForm;
