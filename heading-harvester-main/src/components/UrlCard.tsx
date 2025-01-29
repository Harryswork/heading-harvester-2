import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { HeadingCard } from "./HeadingCard";
import { ExternalLink } from "lucide-react";

interface UrlCardProps {
  url: string;
  headings: Array<{ level: number; text: string }>;
}

export const UrlCard = ({ url, headings }: UrlCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium hover:underline"
        >
          {url}
          <ExternalLink className="h-4 w-4" />
        </a>
      </CardHeader>
      <CardContent className="space-y-3">
        {headings.length > 0 ? (
          headings.map((heading, index) => (
            <HeadingCard key={index} level={heading.level} text={heading.text} />
          ))
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            No headings found
          </p>
        )}
      </CardContent>
    </Card>
  );
};