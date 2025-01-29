import { HeadingCard } from "@/components/HeadingCard";
import { LoadingHeading } from "@/components/LoadingHeading";
import { UrlForm } from "@/components/UrlForm";
import { UrlCard } from "@/components/UrlCard";
import { ApiKeyGenerator } from "@/components/ApiKeyGenerator";
import { toast } from "sonner";
import { useState } from "react";

interface Heading {
  level: number;
  text: string;
}

interface UrlHeadings {
  url: string;
  headings: Heading[];
}

const Index = () => {
  const [urlHeadings, setUrlHeadings] = useState<UrlHeadings[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const extractHeadings = async (urls: string[]) => {
    setIsLoading(true);
    const results: UrlHeadings[] = [];

    try {
      for (const url of urls) {
        try {
          const response = await fetch(
            `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
          );
          if (!response.ok) throw new Error(`Failed to fetch ${url}`);

          const html = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");

          const headingElements = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");
          const extractedHeadings: Heading[] = Array.from(headingElements).map(
            (heading) => ({
              level: parseInt(heading.tagName[1]),
              text: heading.textContent?.trim() || "",
            })
          );

          results.push({
            url,
            headings: extractedHeadings,
          });
        } catch (error) {
          console.error(`Error processing ${url}:`, error);
          toast.error(`Failed to extract headings from ${url}`);
        }
      }

      setUrlHeadings(results);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-12">
      <div className="mb-12 space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Bulk Heading Extractor
        </h1>
        <p className="text-muted-foreground">
          Extract and analyze HTML headings from multiple websites at once
        </p>
      </div>

      <div className="mb-8">
        <UrlForm onSubmit={extractHeadings} isLoading={isLoading} />
      </div>

      <div className="mb-8">
        <ApiKeyGenerator />
      </div>

      <div className="space-y-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <LoadingHeading key={i} />)
        ) : (
          urlHeadings.map((item, index) => (
            <UrlCard key={index} url={item.url} headings={item.headings} />
          ))
        )}
      </div>
    </div>
  );
};

export default Index;
