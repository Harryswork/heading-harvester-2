import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Search } from "lucide-react";
import { useState } from "react";

interface UrlFormProps {
  onSubmit: (urls: string[]) => void;
  isLoading: boolean;
}

export const UrlForm = ({ onSubmit, isLoading }: UrlFormProps) => {
  const [urls, setUrls] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urls.trim()) {
      const urlList = urls
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url.length > 0);
      onSubmit(urlList);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2">
      <Textarea
        placeholder="Enter website URLs (one per line)..."
        value={urls}
        onChange={(e) => setUrls(e.target.value)}
        className="min-h-[120px]"
        required
      />
      <Button type="submit" disabled={isLoading} className="self-end">
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
        ) : (
          <Search className="h-4 w-4" />
        )}
        <span className="ml-2">Extract All</span>
      </Button>
    </form>
  );
};