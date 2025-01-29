import { Card } from "@/components/ui/card";

export const LoadingHeading = () => {
  return (
    <Card className="flex items-center gap-4 p-4">
      <div className="h-6 w-10 animate-pulse rounded-full bg-muted"></div>
      <div className="h-4 flex-1 animate-pulse rounded bg-muted"></div>
    </Card>
  );
};