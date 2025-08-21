import { useState } from "react";
import axios from "axios";
import { useToast } from "../../hooks/use-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { LoaderCircle, Send } from "lucide-react";

const AnnouncementForm = ({ onAnnouncementAdded }) => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeAndDate, setTimeAndDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !timeAndDate) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Title, description, and date are required.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/announcements`,
        { title, timeAndDate, description }
      );
      toast({
        title: "Announcement added 🎉",
        description: `“${res.data.announcement.title}” has been published.`,
      });
      if (onAnnouncementAdded) {
        onAnnouncementAdded(res.data.announcement);
      }
      setTitle("");
      setDescription("");
      setTimeAndDate("");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to add announcement ❌",
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
          <CardTitle>Create a New Announcement</CardTitle>
          <CardDescription>
            Publish news and updates for everyone to see.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g., Festival Schedule Update"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write the full announcement details here..."
                className="min-h-[120px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date of Announcement</Label>
              <Input
                id="date"
                type="date"
                value={timeAndDate}
                onChange={(e) => setTimeAndDate(e.target.value)}
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
                  Publishing...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Publish Announcement
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnnouncementForm;
