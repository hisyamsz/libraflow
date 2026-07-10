"use client";

import { useMemo, useEffect, useState, Fragment } from "react";
import { useAuthStore } from "@/stores/auth-store";
import environment from "@/config/environment";
import { getSession } from "next-auth/react";
import { SessionExtended } from "@/types/Auth";
import { toast } from "sonner";

import { useQuery } from "@tanstack/react-query";
import { BookCopy, FileText, Calendar as CalendarIcon } from "lucide-react";
import { QUERY_KEYS } from "@/constants/query-key.constants";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import loanService from "@/services/loan.service";
import { Loan } from "@/types/Loan";
import DataTable from "@/components/ui/data-table";
import {
  HEADER_TABLE_LOAN_ADMIN,
  formatDate,
} from "@/constants/loan.constants";
import useDataTable from "@/hooks/use-data-table";
import RefreshButton from "@/components/common/refresh-button";
import LoanStatusCell from "@/components/common/loan-status-cell";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/common/search-input";
import DialogApproveLoan from "./DialogApproveLoan";
import DialogRejectLoan from "./DialogRejectLoan";
import DialogReturnLoan from "./DialogReturnLoan";
import LoanActionCell from "./LoanActionCell";
import { highlightText } from "@/lib/highlight";
import TableEmptyState from "@/components/common/table-empty-state";

export default function AdminLoans() {
  const {
    currentLimit,
    currentPage,
    currentSearch,
    currentStartDate,
    currentEndDate,
    handleChangeLimit,
    handleChangePage,
    handleSearch,
    handleClearSearch,
    handleChangeStartDate,
    handleChangeEndDate,
    handleResetDates,
    setUrl,
  } = useDataTable();

  const [searchValue, setSearchValue] = useState<string>(currentSearch);
  const [selectedAction, setSelectedAction] = useState<{
    data: Loan;
    type: "approve" | "reject" | "return";
  } | null>(null);

  const startDate = currentStartDate ? new Date(currentStartDate) : undefined;
  const endDate = currentEndDate ? new Date(currentEndDate) : undefined;

  const { data: allLoansData } = useQuery({
    queryKey: [QUERY_KEYS.LOANS, "admin", "all", currentSearch],
    queryFn: async () => {
      let params = "all=true";
      if (currentSearch) params += `&search=${currentSearch}`;
      const res = await loanService.getLoans(params);
      return res.data.data as Loan[];
    },
  });

  const loanDatesSet = useMemo(() => {
    const dates = new Set<string>();
    if (allLoansData) {
      allLoansData.forEach((loan) => {
        if (loan.loanDate) {
          const dateStr = format(new Date(loan.loanDate), "yyyy-MM-dd");
          dates.add(dateStr);
        }
      });
    }
    return dates;
  }, [allLoansData]);

  const hasLoan = (date: Date) => {
    if (!allLoansData) return false;
    const dateStr = format(date, "yyyy-MM-dd");
    const isSelected =
      (startDate && format(startDate, "yyyy-MM-dd") === dateStr) ||
      (endDate && format(endDate, "yyyy-MM-dd") === dateStr);
    return loanDatesSet.has(dateStr) && !isSelected;
  };

  const noLoan = (date: Date) => {
    if (!allLoansData) return false;
    const dateStr = format(date, "yyyy-MM-dd");
    const isSelected =
      (startDate && format(startDate, "yyyy-MM-dd") === dateStr) ||
      (endDate && format(endDate, "yyyy-MM-dd") === dateStr);
    return !loanDatesSet.has(dateStr) && !isSelected;
  };

  const {
    data: dataLoans,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [
      QUERY_KEYS.LOANS,
      "admin",
      currentLimit,
      currentPage,
      currentSearch,
      currentStartDate,
      currentEndDate,
    ],
    queryFn: async () => {
      let params = `page=${currentPage}&limit=${currentLimit}&search=${currentSearch}`;
      if (currentStartDate) params += `&startDate=${currentStartDate}`;
      if (currentEndDate) params += `&endDate=${currentEndDate}`;

      const res = await loanService.getLoans(params);
      return res.data;
    },
  });

  const handlePrint = async () => {
    if (!currentStartDate) {
      toast.error("Silakan tentukan tanggal awal transaksi terlebih dahulu sebelum mencetak laporan.");
      return;
    }

    let accessToken = useAuthStore.getState().user?.accessToken;
    if (!accessToken) {
      const session: SessionExtended | null = await getSession();
      if (session?.accessToken) {
        accessToken = session.accessToken;
      }
    }

    if (!accessToken) {
      alert("Sesi tidak valid, silakan login kembali.");
      return;
    }

    let printUrl = `${environment.API_URL}/loans/export/pdf?token=${accessToken}`;
    if (currentStartDate) printUrl += `&startDate=${currentStartDate}`;
    if (currentEndDate) printUrl += `&endDate=${currentEndDate}`;
    if (currentSearch) printUrl += `&search=${currentSearch}`;

    window.open(printUrl, "_blank");
  };

  useEffect(() => {
    setUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tableData = useMemo(() => {
    const loans: Loan[] = dataLoans?.data || [];

    return loans.map((loan, index) => [
      index + 1,

      <div key={`book-${loan.id}`} className="min-w-[200px] flex items-center gap-2">
        <BookCopy className="text-muted-foreground h-4 w-4 shrink-0" />
        <span className="line-clamp-2 text-sm font-medium">
          {loan.book?.title
            ? highlightText(loan.book.title, currentSearch)
            : "-"}
        </span>
      </div>,

      <div key={`user-${loan.id}`} className="min-w-[180px]">
        <p className="text-sm font-medium">
          {loan.user?.name ? highlightText(loan.user.name, currentSearch) : "-"}
        </p>
        <p className="text-muted-foreground text-xs">
          NIS:{" "}
          {loan.user?.nis ? highlightText(loan.user.nis, currentSearch) : "-"}
        </p>
        {loan.user?.class && (
          <p className="text-muted-foreground text-xs">
            Kelas: {highlightText(loan.user.class, currentSearch)}
          </p>
        )}
      </div>,

      loan.loanDate ? formatDate(loan.loanDate) : "-",

      loan.dueDate ? formatDate(loan.dueDate) : "-",

      <LoanStatusCell key={`status-${loan.id}`} loan={loan} />,

      <LoanActionCell
        key={`action-${loan.id}`}
        loan={loan}
        onAction={(data, type) => setSelectedAction({ data, type })}
      />,
    ]);
  }, [dataLoans?.data, currentSearch]);

  const totalPages = useMemo(
    () => dataLoans?.pagination?.totalPage ?? 0,
    [dataLoans],
  );

  return (
    <Fragment>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center lg:flex-nowrap lg:justify-between">
        {/* Search Input */}
        <SearchInput
          placeholder="Cari peminjam atau buku..."
          value={searchValue}
          onChange={(val) => {
            setSearchValue(val);
            handleSearch(val);
          }}
          onClear={() => {
            setSearchValue("");
            handleClearSearch();
          }}
          containerClassName="order-1 w-full md:w-auto md:flex-1"
        />

        {/* Dates Wrapper */}
        <div className="order-2 flex w-full flex-col gap-2 sm:flex-row sm:items-center md:order-3 md:w-full lg:order-2 lg:w-auto">
          <div className="flex w-full items-center gap-2 md:flex-1 lg:w-auto">
            <span className="text-muted-foreground w-12 shrink-0 text-xs sm:w-auto">
              Dari:
            </span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "h-9 flex-1 shrink-0 justify-start text-left text-xs font-normal lg:w-[150px] lg:flex-initial",
                    !startDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">
                    {startDate
                      ? format(startDate, "dd MMM yyyy")
                      : "Awal Transaksi"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={handleChangeStartDate}
                  modifiers={{
                    hasLoan,
                    noLoan,
                  }}
                  modifiersClassNames={{
                    hasLoan: "font-semibold text-emerald-600 dark:text-emerald-400",
                    noLoan: "opacity-35 hover:opacity-80 transition-opacity",
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex w-full items-center gap-2 md:flex-1 lg:w-auto">
            <span className="text-muted-foreground w-12 shrink-0 text-xs sm:w-auto">
              Sampai:
            </span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "h-9 flex-1 shrink-0 justify-start text-left text-xs font-normal lg:w-[150px] lg:flex-initial",
                    !endDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">
                    {endDate ? format(endDate, "dd MMM yyyy") : "Hari Ini"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={handleChangeEndDate}
                  modifiers={{
                    hasLoan,
                    noLoan,
                  }}
                  modifiersClassNames={{
                    hasLoan: "font-semibold text-emerald-600 dark:text-emerald-400",
                    noLoan: "opacity-35 hover:opacity-80 transition-opacity",
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {(startDate || endDate) && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleResetDates}
              className="h-9 w-full shrink-0 px-2 text-xs text-red-500 hover:text-red-600 md:w-auto"
            >
              Reset
            </Button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="order-3 flex w-full items-center justify-end gap-2 md:order-2 md:w-auto md:justify-start lg:order-3">
          <Button
            onClick={handlePrint}
            variant="default"
            className="flex h-9 flex-1 shrink-0 cursor-pointer items-center justify-center gap-2 bg-emerald-600 text-xs text-white hover:bg-emerald-700 md:w-auto md:flex-initial"
          >
            <FileText className="h-4 w-4 shrink-0" />
            <span className="truncate">Cetak Laporan</span>
          </Button>
          <RefreshButton onRefresh={() => refetch()} isLoading={isFetching} />
        </div>
      </div>

      <DataTable
        header={HEADER_TABLE_LOAN_ADMIN}
        data={tableData}
        isLoading={isLoading}
        isFetching={isFetching}
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
              title="Belum Ada Peminjaman"
              description="Saat ini belum ada data transaksi peminjaman buku oleh anggota."
            />
          )
        }
      />

      <DialogApproveLoan
        currentData={
          selectedAction?.type === "approve" ? selectedAction.data : null
        }
        open={selectedAction?.type === "approve"}
        handleChangeAction={(open) => {
          if (!open) setSelectedAction(null);
        }}
      />

      <DialogRejectLoan
        currentData={
          selectedAction?.type === "reject" ? selectedAction.data : null
        }
        open={selectedAction?.type === "reject"}
        handleChangeAction={(open) => {
          if (!open) setSelectedAction(null);
        }}
      />

      <DialogReturnLoan
        currentData={
          selectedAction?.type === "return" ? selectedAction.data : null
        }
        open={selectedAction?.type === "return"}
        handleChangeAction={(open) => {
          if (!open) setSelectedAction(null);
        }}
      />
    </Fragment>
  );
}
