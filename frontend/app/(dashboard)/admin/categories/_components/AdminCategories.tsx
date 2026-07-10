"use client";

import categoryService from "@/services/category.service";
import { useQuery } from "@tanstack/react-query";
import DataTable from "@/components/ui/data-table";
import { HEADER_TABLE_CATEGORY } from "@/constants/category.constants";
import { Category } from "@/types/Category";
import { Fragment, useEffect, useMemo, useState } from "react";
import DropdownAction from "@/components/common/dropdown-action";
import { Edit, Trash, FolderPlus } from "lucide-react";
import useDataTable from "@/hooks/use-data-table";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/common/search-input";
import { Dialog } from "@/components/ui/dialog";
import DialogAddCategoryForm from "./DialogAddCategoryForm";
import DialogEditCategoryForm from "./DialogEditCategoryForm";
import DialogDeleteCategory from "./DialogDeleteCategory";
import RefreshButton from "@/components/common/refresh-button";
import { highlightText } from "@/lib/highlight";
import TableEmptyState from "@/components/common/table-empty-state";

export default function AdminCategories() {
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
  const [searchValue, setSearchValue] = useState(currentSearch);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedAction, setSelectedAction] = useState<{
    data: Category;
    type: "update" | "delete";
  } | null>(null);

  const {
    data: dataCategories,
    isLoading: isLoadingCategories,
    isFetching: isFetchingCategories,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["categories", currentLimit, currentPage, currentSearch],
    queryFn: async () => {
      const params = `page=${currentPage}&limit=${currentLimit}&search=${currentSearch}`;
      const res = await categoryService.getAllCategories(params);
      return res.data;
    },
  });

  useEffect(() => {
    setUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredData = useMemo(() => {
    const categories: Category[] = dataCategories?.data || [];

    return categories.map((category, index) => {
      return [
        index + 1,
        highlightText(category.name, currentSearch),
        category.description ? highlightText(category.description, currentSearch) : "-",
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
              action: () =>
                setSelectedAction({ data: category, type: "update" }),
            },
            {
              label: (
                <span className="flex items-center gap-2">
                  <Trash />
                  Hapus
                </span>
              ),
              variant: "destructive",
              action: () =>
                setSelectedAction({ data: category, type: "delete" }),
            },
          ]}
        />,
      ];
    });
  }, [dataCategories?.data, currentSearch]);

  const totalPages = useMemo(() => {
    return dataCategories?.pagination?.totalPage ?? 0;
  }, [dataCategories]);

  return (
    <Fragment>
      <div className="mb-4 flex flex-col gap-4">
        <div className="flex flex-row items-center gap-2">
          <SearchInput
            placeholder="Cari kategori..."
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
            onRefresh={() => refetchCategories()}
            isLoading={isFetchingCategories}
          />
          <Button
            size="lg"
            className="hidden md:flex items-center gap-2"
            onClick={() => setOpenAddDialog(true)}
          >
            <FolderPlus className="h-4 w-4" />
            Tambah Kategori
          </Button>
        </div>
        <div className="flex md:hidden">
          <Button
            size="lg"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => setOpenAddDialog(true)}
          >
            <FolderPlus className="h-4 w-4" />
            Tambah Kategori
          </Button>
        </div>
      </div>

      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogAddCategoryForm
          open={openAddDialog}
          handleChangeAction={setOpenAddDialog}
        />
      </Dialog>

      <DataTable
        header={HEADER_TABLE_CATEGORY}
        data={filteredData}
        isLoading={isLoadingCategories}
        isFetching={isFetchingCategories}
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
              title="Kategori Kosong"
              description="Tambahkan kategori baru untuk mengklasifikasikan buku."
              actionButton={{
                label: "Tambah Kategori",
                onClick: () => setOpenAddDialog(true),
              }}
            />
          )
        }
      />

      <DialogEditCategoryForm
        currentData={
          selectedAction?.type === "update" ? selectedAction.data : null
        }
        open={selectedAction?.type === "update"}
        handleChangeAction={(open) => {
          if (!open) setSelectedAction(null);
        }}
      />

      <DialogDeleteCategory
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
