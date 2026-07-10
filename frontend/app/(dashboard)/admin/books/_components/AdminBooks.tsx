"use client";

import bookService from "@/services/book.service";
import { useQuery } from "@tanstack/react-query";
import DataTable from "@/components/ui/data-table";
import { HEADER_TABLE_BOOK } from "@/constants/book.constants";
import { Book } from "@/types/Book";
import { Fragment, useEffect, useMemo, useState } from "react";
import DropdownAction from "@/components/common/dropdown-action";
import { BookCopy, Edit, Trash, BookPlus } from "lucide-react";
import useDataTable from "@/hooks/use-data-table";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/common/search-input";
import { Dialog } from "@/components/ui/dialog";
import DialogAddBookForm from "./DialogAddBookForm";
import DialogEditBookForm from "./DialogEditBookForm";
import DialogDeleteBook from "./DialogDeleteBook";
import Image from "next/image";
import RefreshButton from "@/components/common/refresh-button";
import { highlightText } from "@/lib/highlight";
import TableEmptyState from "@/components/common/table-empty-state";
import { getGoogleDriveDirectLink } from "@/lib/utils";

const BookCover = ({ src, title }: { src?: string | null; title: string }) => {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="bg-muted text-muted-foreground flex h-14 w-10 shrink-0 items-center justify-center rounded">
        <BookCopy size={20} />
      </div>
    );
  }

  const directSrc = getGoogleDriveDirectLink(src);

  return (
    <div className="relative h-14 w-10 shrink-0">
      <Image
        src={directSrc}
        alt={title}
        fill
        sizes="40px"
        className="rounded object-cover shadow-sm"
        onError={() => setError(true)}
        priority
      />
    </div>
  );
};

export default function AdminBooks() {
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

  const [searchValue, setSearchValue] = useState<string>(currentSearch);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [selectedAction, setSelectedAction] = useState<{
    data: Book;
    type: "update" | "delete";
  } | null>(null);

  const {
    data: dataBooks,
    isLoading: isLoadingBooks,
    isFetching: isFetchingBooks,
    refetch: refetchBooks,
  } = useQuery({
    queryKey: ["books", currentLimit, currentPage, currentSearch],
    queryFn: async () => {
      const params = `page=${currentPage}&limit=${currentLimit}&search=${currentSearch}`;
      const res = await bookService.getAllBooks(params);
      return res.data;
    },
  });

  useEffect(() => {
    setUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredData = useMemo(() => {
    const books: Book[] = dataBooks?.data || [];

    return books.map((book, index) => {
      const stockColor =
        book.stock === 0
          ? "text-red-500 font-semibold"
          : book.stock <= 5
            ? "text-amber-500 font-semibold"
            : "text-green-600 font-semibold";

      return [
        index + 1,

        <div
          key={`cover-${book.id}`}
          className="flex items-center justify-center"
        >
          <BookCover src={book.coverImage} title={book.title} />
        </div>,

        <div key={`title-${book.id}`} className="max-w-50">
          <p className="truncate font-medium" title={book.title}>
            {highlightText(book.title, currentSearch)}
          </p>
        </div>,
        book.isbn ? highlightText(book.isbn, currentSearch) : "-",
        highlightText(book.author, currentSearch),
        book.publisher ? highlightText(book.publisher, currentSearch) : "-",
        book.year ? highlightText(String(book.year), currentSearch) : "-",
        book.category?.name ? highlightText(book.category.name, currentSearch) : "-",

        <span key={`stock-${book.id}`} className={stockColor}>
          {book.stock}
        </span>,

        <DropdownAction
          key={`dropdown-${index}`}
          menu={[
            {
              label: (
                <span className="flex items-center gap-2">
                  <Edit />
                  Edit
                </span>
              ),
              action: () => setSelectedAction({ data: book, type: "update" }),
            },
            {
              label: (
                <span className="flex items-center gap-2">
                  <Trash />
                  Hapus
                </span>
              ),
              variant: "destructive",
              action: () => setSelectedAction({ data: book, type: "delete" }),
            },
          ]}
        />,
      ];
    });
  }, [dataBooks?.data, currentSearch]);

  const totalPages = useMemo(() => {
    return dataBooks?.pagination?.totalPage ?? 0;
  }, [dataBooks]);

  return (
    <Fragment>
      <div className="mb-4 flex flex-col gap-4">
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
          <RefreshButton
            onRefresh={() => refetchBooks()}
            isLoading={isFetchingBooks}
          />
          <Button
            size="lg"
            className="hidden md:flex items-center gap-2"
            onClick={() => setOpenAddDialog(true)}
          >
            <BookPlus className="h-4 w-4" />
            Tambah Buku
          </Button>
        </div>
        <div className="flex md:hidden">
          <Button
            size="lg"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => setOpenAddDialog(true)}
          >
            <BookPlus className="h-4 w-4" />
            Tambah Buku
          </Button>
        </div>
      </div>

      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogAddBookForm
          open={openAddDialog}
          handleChangeAction={setOpenAddDialog}
        />
      </Dialog>

      <DataTable
        header={HEADER_TABLE_BOOK}
        data={filteredData}
        isLoading={isLoadingBooks}
        isFetching={isFetchingBooks}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangeLimit={handleChangeLimit}
        onChangePage={handleChangePage}
        emptyState={
          currentSearch ? (
            <TableEmptyState
              iconType="search"
              title="Pencarian tidak ditemukan"
              description={`Kami tidak dapat menemukan kecocokan untuk kata kunci "${currentSearch}".`}
            />
          ) : (
            <TableEmptyState
              title="Katalog Buku Masih Kosong"
              description="Silakan tambahkan buku baru ke sistem perpustakaan Anda."
              actionButton={{
                label: "Tambah Buku Pertama",
                onClick: () => setOpenAddDialog(true),
              }}
            />
          )
        }
      />

      <DialogEditBookForm
        currentData={
          selectedAction?.type === "update" ? selectedAction.data : null
        }
        open={selectedAction?.type === "update"}
        handleChangeAction={(open) => {
          if (!open) setSelectedAction(null);
        }}
      />

      <DialogDeleteBook
        currentData={
          selectedAction?.type === "delete" ? selectedAction.data : null
        }
        open={selectedAction?.type === "delete"}
        handleChangeAction={(open) => {
          if (!open) setSelectedAction(null);
        }}
      />
    </Fragment>
  );
}
