"use client";

import { useMemo, useEffect, useState, Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookCopy } from "lucide-react";

import loanService from "@/services/loan.service";
import { Loan } from "@/types/Loan";
import DataTable from "@/components/ui/data-table";
import {
  HEADER_TABLE_LOAN_MEMBER,
  formatDate,
} from "@/constants/loan.constants";
import useDataTable from "@/hooks/use-data-table";
import RefreshButton from "@/components/common/refresh-button";
import SearchInput from "@/components/common/search-input";
import LoanStatusCell from "@/components/common/loan-status-cell";
import { highlightText } from "@/lib/highlight";
import TableEmptyState from "@/components/common/table-empty-state";

export default function MemberLoans() {
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

  const {
    data: dataLoans,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["my-loans", currentLimit, currentPage, currentSearch],
    queryFn: async () => {
      const params = `page=${currentPage}&limit=${currentLimit}&search=${currentSearch}`;
      const res = await loanService.getMyLoans(params);
      return res.data;
    },
  });

  useEffect(() => {
    setUrl();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const tableData = useMemo(() => {
    const loans: Loan[] = dataLoans?.data || [];

    return loans.map((loan, index) => [
      index + 1,

      <div key={`book-${loan.id}`} className="flex items-center gap-2">
        <BookCopy className="text-muted-foreground h-4 w-4 shrink-0" />
        <span className="line-clamp-2 text-sm font-medium">
          {loan.book?.title ? highlightText(loan.book.title, currentSearch) : "-"}
        </span>
      </div>,

      loan.loanDate ? formatDate(loan.loanDate) : "-",

      loan.dueDate ? formatDate(loan.dueDate) : "-",

      <LoanStatusCell key={`status-${loan.id}`} loan={loan} />,
    ]);
  }, [dataLoans?.data, currentSearch]);

  const totalPages = useMemo(
    () => dataLoans?.pagination?.totalPage ?? 0,
    [dataLoans],
  );

  return (
    <Fragment>
      <div className="mb-4 flex flex-row items-center gap-2">
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
        <RefreshButton onRefresh={() => refetch()} isLoading={isFetching} />
      </div>

      <DataTable
        header={HEADER_TABLE_LOAN_MEMBER}
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
              description="Anda belum memiliki riwayat peminjaman buku saat ini."
            />
          )
        }
      />
    </Fragment>
  );
}
