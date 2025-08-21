import { useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { useToast } from "../../hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { LoaderCircle, CalendarPlus } from "lucide-react";

const EventForm = ({ onEventAdded }) => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !photo) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "All fields are required.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("photo", photo);

    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/events`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast({
        title: "Event created 🎉",
        description: `“${res.data.event.title}” has been added.`,
      });
      if (onEventAdded) {
        onEventAdded(res.data.event);
      }
      setTitle("");
      setDescription("");
      setPhoto(null);
      e.target.reset();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Upload failed ❌",
        description: err.response?.data?.message || err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center w-full">
      <Card className="w-full max-w-2xl shadow-elegant">
        <CardHeader>
          <CardTitle>Create a New Event</CardTitle>
          <CardDescription>
            Add an upcoming event to the schedule.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="event-title">Event Title</Label>
              <Input
                id="event-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g., Grand Puja Ceremony"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-description">Event Description</Label>
              <Textarea
                id="event-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the event details..."
                className="min-h-[120px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-photo">Event Photo</Label>
              <Input
                id="event-photo"
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              />
            </div>
            <Button
              type="submit"
              className="w-full sm:w-auto btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Adding Event...
                </>
              ) : (
                <>
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Add Event
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventForm;
