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
import { LoaderCircle, UploadCloud } from "lucide-react";

const MediaForm = ({ onMediaAdded }) => {
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
        `${import.meta.env.VITE_API_URL}/api/media`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast({
        title: "Upload successful 🎉",
        description: `“${res.data.media.title}” has been uploaded.`,
      });
      if (onMediaAdded) {
        onMediaAdded(res.data.media);
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
          <CardTitle>Upload New Media</CardTitle>
          <CardDescription>
            Add a new photo to the public gallery.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="media-title">Title</Label>
              <Input
                id="media-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g., Evening Aarti"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media-description">Description</Label>
              <Textarea
                id="media-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A short description of the photo..."
                className="min-h-[120px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media-photo">Photo</Label>
              <Input
                id="media-photo"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setPhoto(e.target.files ? e.target.files[0] : null)
                }
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
                  Uploading...
                </>
              ) : (
                <>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Upload Media
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaForm;
