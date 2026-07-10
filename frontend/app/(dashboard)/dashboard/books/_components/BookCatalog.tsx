"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query-key.constants";

import bookService from "@/services/book.service";
import loanService from "@/services/loan.service";
import { Book } from "@/types/Book";
import { extractErrorMessage } from "@/lib/error-extractor";
import { LIMIT_LISTS } from "@/constants/data-table-constants";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useDataTable from "@/hooks/use-data-table";
import PaginationDataTable from "@/components/common/pagination-data-table";
import TableEmptyState from "@/components/common/table-empty-state";
import BookCard from "./BookCard";
import SearchInput from "@/components/common/search-input";

export default function BookCatalog() {
  const {
    currentLimit,
    currentPage,
    currentSearch,
    handleChangeLimit,
    handleChangePage,
    handleSearch,
    handleClearSearch,
    setUrl,
  } = useDataTable();

  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState<string>(currentSearch);
  const [submittingId, setSubmittingId] = useState<number | null>(null);

  const { data: dataBooks, isLoading } = useQuery({
    queryKey: ["books-catalog", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const params = `page=${currentPage}&limit=${currentLimit}&search=${currentSearch}`;
      const res = await bookService.getAllBooks(params);
      return res.data;
    },
  });

  useEffect(() => {
    setUrl();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const books: Book[] = useMemo(() => dataBooks?.data || [], [dataBooks?.data]);
  const totalPages: number = useMemo(
    () => dataBooks?.pagination?.totalPage ?? 0,
    [dataBooks],
  );

  const { mutateAsync: submitLoan } = useMutation({
    mutationFn: (bookId: number) => loanService.submitLoan(bookId),
    onMutate: (bookId) => setSubmittingId(bookId),
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center gap-2">
        <SearchInput
          placeholder="Cari buku..."
          value={searchValue}
          onChange={(val) => {
            setSearchValue(val);
            handleSearch(val);
          }}
          onClear={() => {
            setSearchValue("");
            handleClearSearch();
          }}
        />

        <div className="flex shrink-0 items-center gap-2">
          <span className="text-muted-foreground hidden text-sm whitespace-nowrap sm:inline">
            Tampilkan
          </span>
          <Select
            value={String(currentLimit)}
            onValueChange={(val) => handleChangeLimit(Number(val))}
          >
            <SelectTrigger className="h-9 w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LIMIT_LISTS.map((limit) => (
                <SelectItem key={limit} value={String(limit)}>
                  {limit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-muted-foreground text-sm">buku</span>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: currentLimit }).map((_, i) => (
            <Card key={i} className="animate-pulse overflow-hidden p-0">
              <div className="bg-muted h-52 w-full sm:h-60" />
              <CardContent className="flex flex-col gap-2 p-4">
                <div className="bg-muted h-4 w-3/4 rounded" />
                <div className="bg-muted h-3 w-1/2 rounded" />
                <div className="bg-muted mt-2 h-8 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : books.length === 0 ? (
        currentSearch ? (
          <TableEmptyState
            iconType="search"
            title="Pencarian tidak ditemukan"
            description={`Kami tidak dapat menemukan buku dengan kata kunci "${currentSearch}".`}
          />
        ) : (
          <TableEmptyState
            title="Katalog Kosong"
            description="Belum ada buku yang tersedia di perpustakaan saat ini."
          />
        )
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onBorrow={(bookId) => {
                toast.promise(
                  submitLoan(bookId).then(() => {
                    queryClient.invalidateQueries({
                      queryKey: [QUERY_KEYS.BOOKS_CATALOG],
                    });
                    queryClient.invalidateQueries({
                      queryKey: [QUERY_KEYS.MEMBER_STATS],
                    });
                    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_STATS] });
                    setSubmittingId(null);
                  }),
                  {
                    loading: "Mengajukan peminjaman...",
                    success: "Berhasil mengajukan peminjaman buku!",
                    error: (err) => {
                      setSubmittingId(null);
                      return extractErrorMessage(
                        err,
                        "Gagal mengajukan peminjaman",
                      );
                    },
                  },
                );
              }}
              isSubmitting={submittingId === book.id}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center">
          <PaginationDataTable
            totalPages={totalPages}
            currentPage={currentPage}
            onChangePage={handleChangePage}
          />
        </div>
      )}
    </div>
  );
}
