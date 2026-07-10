import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  className?: string;
  containerClassName?: string;
}

export default function SearchInput({
  placeholder = "Cari...",
  value,
  onChange,
  onClear,
  className,
  containerClassName,
}: SearchInputProps) {
  return (
    <div className={cn("flex flex-1 items-center gap-2", containerClassName)}>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn("h-9 flex-1", className)}
      />
      {value && (
        <Button
          variant="outline"
          size="icon-lg"
          title="Hapus pencarian"
          onClick={onClear}
          className="shrink-0"
          type="button"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
