import { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { EllipsisVertical } from "lucide-react";

interface DropdownActionProps {
  menu: {
    label: string | ReactNode;
    variant?: "default" | "destructive";
    action?: () => void;
    type?: "button" | "link";
  }[];
}

export default function DropdownAction({ menu }: DropdownActionProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex text-muted-foreground size-8"
          size="icon"
        >
          <EllipsisVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="flex flex-col w-32 gap-1">
        {menu.map((item, index) => (
          <DropdownMenuItem
            key={`dropdown-menu-action-${index}`}
            variant={item.variant || "default"}
            onClick={item.action}
            asChild={item.type === "link"}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
