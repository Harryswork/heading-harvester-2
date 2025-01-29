import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { generateApiKey } from "@/lib/api";
import { toast } from "sonner";
import { Copy } from "lucide-react";

export const ApiKeyGenerator = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateKey = async () => {
    setIsLoading(true);
    try {
      const response = await generateApiKey();
      if (response) {
        setApiKey(response.apiKey);
        toast.success("API key generated successfully");
      }
    } catch (error) {
      toast.error("Failed to generate API key");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      toast.success("API key copied to clipboard");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>API Access</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Generate an API key to access the heading extractor via REST API
        </p>
        {apiKey ? (
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-muted p-2 font-mono text-sm">
              {apiKey}
            </code>
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              className="shrink-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button onClick={handleGenerateKey} disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate API Key"}
          </Button>
        )}
        {apiKey && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Example cURL request:</p>
            <code className="block whitespace-pre-wrap rounded bg-muted p-2 text-xs">
              {`curl -X POST \\
  'https://your-project.supabase.co/functions/v1/extract-headings' \\
  -H 'Authorization: Bearer ${apiKey}' \\
  -H 'Content-Type: application/json' \\
  -d '{"urls": ["https://example.com"]}'`}
            </code>
          </div>
        )}
      </CardContent>
    </Card>
  );
};