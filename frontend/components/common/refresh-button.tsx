import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface RefreshButtonProps {
  onRefresh: () => void;
  isLoading?: boolean;
  className?: string;
}

export default function RefreshButton({
  onRefresh,
  isLoading,
  className,
}: RefreshButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon-lg"
      onClick={onRefresh}
      disabled={isLoading}
      className={cn("shrink-0", className)}
      title="Refresh data"
      type="button"
      suppressHydrationWarning
    >
      <RotateCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
    </Button>
  );
}
