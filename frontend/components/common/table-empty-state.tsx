import { AlertCircle, Search, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TableEmptyStateProps {
  iconType?: "search" | "empty" | "error";
  title: string;
  description?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export default function TableEmptyState({
  iconType = "empty",
  title,
  description,
  actionButton,
}: TableEmptyStateProps) {
  
  const renderIcon = () => {
    switch (iconType) {
      case "search":
        return (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-500">
            <Search className="h-8 w-8 animate-pulse" />
          </div>
        );
      case "error":
        return (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/20 text-red-500">
            <AlertCircle className="h-8 w-8" />
          </div>
        );
      default:
        return (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Inbox className="h-8 w-8 text-primary" />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-14 px-4 text-center">
      {renderIcon()}
      <h3 className="mt-4 text-lg font-semibold text-foreground tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {actionButton && (
        <Button
          onClick={actionButton.onClick}
          variant="outline"
          size="sm"
          className="mt-5 border-dashed border-primary/50 hover:border-primary text-primary"
        >
          {actionButton.label}
        </Button>
      )}
    </div>
  );
}
