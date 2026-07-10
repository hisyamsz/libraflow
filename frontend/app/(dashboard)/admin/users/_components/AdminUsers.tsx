"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Edit, Trash, UploadCloud, UserPlus, KeyRound } from "lucide-react";
import userService from "@/services/user.service";
import useDataTable from "@/hooks/use-data-table";
import { HEADER_TABLE_USER } from "@/constants/user.constants";
import { User } from "@/types/User";
import DataTable from "@/components/ui/data-table";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/common/search-input";
import { Badge } from "@/components/ui/badge";
import RefreshButton from "@/components/common/refresh-button";
import DialogAddUser from "./DialogAddUser";
import DialogEditUser from "./DialogEditUser";
import DialogImportExcel from "./DialogImportExcel";
import DialogDeleteUser from "./DialogDeleteUser";
import DialogResetPassword from "./DialogResetPassword";
import { useAuth } from "@/hooks/use-auth";
import { highlightText } from "@/lib/highlight";
import TableEmptyState from "@/components/common/table-empty-state";


export default function AdminUsers() {
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

  const { user: currentUser } = useAuth();

  const [searchValue, setSearchValue] = useState(currentSearch);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [selectedAction, setSelectedAction] = useState<{
    data: User;
    type: "update" | "delete" | "reset";
  } | null>(null);

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isFetching: isFetchingUsers,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["users", currentLimit, currentPage, currentSearch],
    queryFn: async () => {
      const params = `page=${currentPage}&limit=${currentLimit}&search=${currentSearch}`;
      const res = await userService.getUsers(params);
      return res.data;
    },
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    setUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPages = useMemo(() => {
    return usersData?.pagination?.totalPage ?? 0;
  }, [usersData]);

  const formattedTableData = useMemo(() => {
    const usersList: User[] = usersData?.data || [];

    return usersList.map((user, index) => {
      // Hitung nomor urut baris
      const rowNumber = (currentPage - 1) * currentLimit + (index + 1);

      const kelasText = user.class ? (
        highlightText(user.class, currentSearch)
      ) : (
        <span className="text-muted-foreground italic">-</span>
      );

      return [
        rowNumber,
        <div key={`user-${user.id}`} className="text-foreground font-semibold">
          {highlightText(user.name, currentSearch)}
        </div>,
        highlightText(user.nis, currentSearch),
        kelasText,
        user.email ? (
          highlightText(user.email, currentSearch)
        ) : (
          <span className="text-muted-foreground italic">-</span>
        ),
        user.phone ? (
          highlightText(user.phone, currentSearch)
        ) : (
          <span className="text-muted-foreground italic">-</span>
        ),
        <Badge
          key={`badge-${user.id}`}
          className={
            user.role === "ADMIN"
              ? "bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-2.5 py-0.5 font-bold transition-all"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-2.5 py-0.5 font-medium"
          }
        >
          {user.role}
        </Badge>,
        <DropdownAction
          key={`dropdown-${user.id}`}
          menu={[
            {
              label: (
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Edit className="h-4 w-4" />
                  Edit
                </span>
              ),
              action: () => setSelectedAction({ data: user, type: "update" }),
            },
            ...(user.nis === currentUser?.nis
              ? []
              : [
                  {
                    label: (
                      <span className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-500">
                        <KeyRound className="h-4 w-4" />
                        Reset Sandi
                      </span>
                    ),
                    action: () =>
                      setSelectedAction({ data: user, type: "reset" }),
                  },
                  {
                    label: (
                      <span className="text-destructive flex items-center gap-2 text-sm font-medium">
                        <Trash className="h-4 w-4" />
                        Hapus
                      </span>
                    ),
                    variant: "destructive" as const,
                    action: () =>
                      setSelectedAction({ data: user, type: "delete" }),
                  },
                ]),
          ]}
        />,
      ];
    });
  }, [
    usersData?.data,
    currentPage,
    currentLimit,
    currentSearch,
    currentUser?.nis,
  ]);

  return (
    <Fragment>
      <div className="mb-6 flex flex-col gap-4">
        {/* Pencarian, Refresh, dan Tombol Aksi (Desktop ≥ lg: inline dengan search) */}
        <div className="flex flex-row items-center gap-2">
          <SearchInput
            placeholder="Cari berdasarkan nama, NIS atau email..."
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
            onRefresh={() => refetchUsers()}
            isLoading={isFetchingUsers}
          />
          {/* Tombol aksi — hanya tampil di desktop ≥ lg */}
          <Button
            variant="outline"
            size="lg"
            className="hidden items-center gap-2 border-dashed lg:flex"
            onClick={() => setOpenImportDialog(true)}
          >
            <UploadCloud className="text-primary h-4 w-4" />
            Import Excel
          </Button>
          <Button
            size="lg"
            className="hidden items-center gap-2 lg:flex"
            onClick={() => setOpenAddDialog(true)}
          >
            <UserPlus className="h-4 w-4" />
            Tambah User
          </Button>
        </div>

        {/* Tombol aksi full-width — tampil di mobile & tablet, di bawah search */}
        <div className="flex gap-2 lg:hidden">
          <Button
            variant="outline"
            size="lg"
            className="flex flex-1 items-center gap-2 border-dashed"
            onClick={() => setOpenImportDialog(true)}
          >
            <UploadCloud className="text-primary h-4 w-4" />
            Import Excel
          </Button>
          <Button
            size="lg"
            className="flex flex-1 items-center gap-2"
            onClick={() => setOpenAddDialog(true)}
          >
            <UserPlus className="h-4 w-4" />
            Tambah User
          </Button>
        </div>
      </div>

      {/* Tabel Data Utama */}
      <div>
        <DataTable
          header={HEADER_TABLE_USER}
          data={formattedTableData}
          isLoading={isLoadingUsers}
          isFetching={isFetchingUsers}
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
                title="Belum Ada Pengguna"
                description="Tambahkan pengguna baru ke dalam sistem untuk mulai mengelola akses."
                actionButton={{
                  label: "Tambah Pengguna Baru",
                  onClick: () => setOpenAddDialog(true),
                }}
              />
            )
          }
        />
      </div>

      {/* Modal - Modal Kontrol */}
      <DialogAddUser
        open={openAddDialog}
        handleChangeAction={setOpenAddDialog}
      />

      <DialogEditUser
        currentData={
          selectedAction?.type === "update" ? selectedAction.data : null
        }
        open={selectedAction?.type === "update"}
        handleChangeAction={(open: boolean) => {
          if (!open) setSelectedAction(null);
        }}
      />

      <DialogDeleteUser
        currentData={
          selectedAction?.type === "delete" ? selectedAction.data : null
        }
        open={selectedAction?.type === "delete"}
        handleChangeAction={(open: boolean) => {
          if (!open) setSelectedAction(null);
        }}
      />

      <DialogImportExcel
        open={openImportDialog}
        handleChangeAction={setOpenImportDialog}
      />

      <DialogResetPassword
        currentData={
          selectedAction?.type === "reset" ? selectedAction.data : null
        }
        open={selectedAction?.type === "reset"}
        onOpenChange={(open: boolean) => {
          if (!open) setSelectedAction(null);
        }}
      />
    </Fragment>
  );
}
