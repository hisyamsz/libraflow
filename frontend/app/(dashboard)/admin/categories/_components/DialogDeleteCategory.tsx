"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query-key.constants";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import categoryService from "@/services/category.service";
import { Spinner } from "@/components/ui/spinner";
import { Category } from "@/types/Category";
import { extractErrorMessage } from "@/lib/error-extractor";

interface DialogDeleteCategoryProps {
  currentData: Category | null;
  open: boolean;
  handleChangeAction: (open: boolean) => void;
}

export default function DialogDeleteCategory({
  currentData,
  open,
  handleChangeAction,
}: DialogDeleteCategoryProps) {
  const queryClient = useQueryClient();

  const { mutateAsync: mutateDeleteCategory, isPending } = useMutation({
    mutationFn: () => categoryService.deleteCategory(String(currentData?.id)),
  });

  return (
    <AlertDialog open={open} onOpenChange={handleChangeAction}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini akan menghapus data kategori secara permanen dan tidak
            dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              if (currentData?.id) {
                toast.promise(
                  mutateDeleteCategory().then(() => {
                    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
                    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_STATS] });
                    handleChangeAction(false);
                  }),
                  {
                    loading: "Menghapus kategori...",
                    success: "Kategori berhasil dihapus!",
                    error: (err) => extractErrorMessage(err, "Gagal menghapus kategori"),
                  }
                );
              }
            }}
            disabled={isPending}
            variant="destructive"
          >
            {isPending ? (
              <>
                <Spinner className="mr-2" />
                Menghapus...
              </>
            ) : (
              "Hapus"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
