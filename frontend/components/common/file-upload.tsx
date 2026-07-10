"use client";

import { useRef, useState, DragEvent, ChangeEvent, ReactNode } from "react";
import { UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FileUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
  disabled?: boolean;
  placeholder?: string;
  description?: string;
  icon?: ReactNode;
  selectedIcon?: ReactNode;
  className?: string;
}

export default function FileUpload({
  value,
  onChange,
  accept,
  maxSizeMB = 5,
  disabled = false,
  placeholder = "Klik untuk memilih file",
  description,
  icon = <UploadCloud className="w-6 h-6" />,
  selectedIcon,
  className = "",
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): boolean => {
    // Validasi ukuran berkas
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`Ukuran file "${file.name}" melebihi batas!`, {
        description: `Maksimal ukuran file yang diizinkan adalah ${maxSizeMB} MB.`,
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return false;
    }
    return true;
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      onChange(file);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      onChange(file);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 transition-all ${
          isDragging
            ? "border-primary bg-primary/10 scale-[1.02]"
            : "border-muted bg-accent/20 hover:bg-accent/40"
        } ${disabled ? "opacity-60 pointer-events-none" : ""}`}
      >
        <input
          type="file"
          id="global-file-upload"
          accept={accept}
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={disabled}
        />

        {!value ? (
          <label
            htmlFor="global-file-upload"
            className="flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div className="p-3 bg-primary/10 rounded-full text-primary group-hover:scale-110 transition-transform">
              {icon}
            </div>
            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
              {placeholder}
            </span>
            {description && (
              <span className="text-xs text-muted-foreground">
                {description}
              </span>
            )}
          </label>
        ) : (
          <div className="flex items-center justify-between w-full bg-background border border-border/80 px-4 py-3 rounded-lg shadow-sm gap-2">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="shrink-0 text-emerald-500">
                {selectedIcon || icon}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-semibold truncate w-full">
                  {value.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {(value.size / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="hover:bg-accent rounded-full shrink-0"
              onClick={() => {
                onChange(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              disabled={disabled}
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
