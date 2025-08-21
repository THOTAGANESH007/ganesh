import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button";

const ImageLightbox = ({ item, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in-25"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-4xl p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-background rounded-lg shadow-xl overflow-hidden">
          <img
            src={item.photo.url}
            alt={item.title}
            className="w-full h-auto max-h-[80vh] object-contain"
          />
          <div className="p-6">
            <h3 className="text-2xl font-bold text-foreground">{item.title}</h3>
            <p className="mt-2 text-muted-foreground">{item.description}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-2 -right-2 h-10 w-10 rounded-full bg-background/50 text-foreground hover:bg-background"
          onClick={onClose}
          aria-label="Close image view"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default ImageLightbox;
