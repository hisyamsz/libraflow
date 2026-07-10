import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  className?: string;
  valueClassName?: string;
  description?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  className,
  valueClassName,
  description,
}: StatCardProps) {
  return (
    <Card className={cn("bg-card/70 dark:bg-card/40 dark:border-white/5 backdrop-blur-md transition-all duration-300 hover:shadow-md dark:hover:shadow-[0_8px_30px_rgb(99,102,241,0.04)] hover:-translate-y-1 hover:border-primary/20 dark:hover:border-primary/20 cursor-default", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", valueClassName)}>{value}</div>
        {description && (
          <p className="text-xs mt-1 text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
