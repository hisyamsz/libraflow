"use client";

import { BookOpen } from "lucide-react";

import { Book } from "@/types/Book";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import BookCover from "./BookCover";

interface BookCardProps {
  book: Book;
  onBorrow: (bookId: number) => void;
  isSubmitting: boolean;
}

export default function BookCard({ book, onBorrow, isSubmitting }: BookCardProps) {
  const isOutOfStock = book.stock <= 0;

  return (
    <Card className="flex flex-col overflow-hidden p-0 bg-card/75 dark:bg-card/45 dark:border-white/5 backdrop-blur-md transition-all duration-300 hover:shadow-xl dark:hover:shadow-[0_8px_30px_rgb(99,102,241,0.04)] hover:-translate-y-1 hover:border-primary/25 dark:hover:border-primary/20">
      <BookCover src={book.coverImage} title={book.title} />
      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex-1">
          <p
            className="line-clamp-2 text-sm leading-tight font-semibold sm:text-base"
            title={book.title}
          >
            {book.title}
          </p>
          <p className="text-muted-foreground mt-1 truncate text-xs sm:text-sm">
            {book.author}
          </p>
          {book.category && (
            <span className="mt-2 inline-block rounded-full bg-primary/10 dark:bg-primary/15 px-2.5 py-0.5 text-xs text-primary font-medium border border-primary/20 dark:border-primary/10">
              {book.category.name}
            </span>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span
            className={`text-xs font-semibold ${
              isOutOfStock ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {isOutOfStock ? "Stok Habis" : "Tersedia"}
          </span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                className="flex items-center gap-1"
                disabled={isOutOfStock || isSubmitting}
                title={isOutOfStock ? "Stok habis" : "Pinjam buku ini"}
              >
                <BookOpen className="h-3.5 w-3.5" />
                {isSubmitting ? "Memproses..." : isOutOfStock ? "Habis" : "Pinjam"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Konfirmasi Peminjaman</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin meminjam buku{" "}
                  <strong>{book.title}</strong>? Pastikan Anda mengembalikan
                  buku tepat waktu.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isSubmitting}>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    if (isSubmitting) {
                      e.preventDefault();
                      return;
                    }
                    onBorrow(book.id);
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Memproses..." : "Ya, Pinjam"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
