import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface HeadingCardProps {
  level: number;
  text: string;
}

export const HeadingCard = ({ level, text }: HeadingCardProps) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <Card className="group relative flex items-center justify-between gap-4 p-4 transition-all hover:shadow-md">
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="h-6 min-w-[2.5rem] justify-center">
          h{level}
        </Badge>
        <p className="text-sm font-medium">{text}</p>
      </div>
      <button
        onClick={copyToClipboard}
        className="rounded-full p-2 opacity-0 transition-opacity hover:bg-secondary group-hover:opacity-100"
        aria-label="Copy heading text"
      >
        <Copy className="h-4 w-4" />
      </button>
    </Card>
  );
};