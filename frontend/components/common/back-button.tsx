"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackButton() {
  return (
    <Button
      id="btn-go-back"
      variant="ghost"
      size="sm"
      onClick={() => history.back()}
      className="text-muted-foreground hover:text-foreground gap-1.5"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      Kembali ke halaman sebelumnya
    </Button>
  );
}
