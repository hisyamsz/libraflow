import { ReactNode } from "react";
import { Card } from "./card";
import { Skeleton } from "./skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import PaginationDataTable from "../common/pagination-data-table";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";
import { LIMIT_LISTS } from "@/constants/data-table-constants";

interface DataTableProps {
  header: string[];
  data: (string | ReactNode)[][];
  isLoading: boolean;
  isFetching?: boolean;
  totalPages: number;
  currentPage: number;
  currentLimit: number;
  onChangeLimit: (limit: number) => void;
  onChangePage: (page: number) => void;
  emptyState?: ReactNode;
}

export default function DataTable({
  header,
  data,
  isLoading,
  isFetching = false,
  totalPages,
  currentPage,
  currentLimit,
  onChangeLimit,
  onChangePage,
  emptyState,
}: DataTableProps) {
  return (
    <div className="flex flex-col w-full gap-4">
      <Card className="relative p-0 overflow-hidden">
        {isFetching && !isLoading && (
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary/10 overflow-hidden z-20">
            <div
              className="h-full bg-primary rounded-full"
              style={{
                width: "40%",
                animation: "dataTableLoading 1.2s infinite linear",
              }}
            />
            <style>{`
              @keyframes dataTableLoading {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(250%); }
              }
            `}</style>
          </div>
        )}
        <Table className="w-full overflow-hidden rounded-lg">
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow>
              {header.map((column) => (
                <TableHead key={`th-${column}`} className="px-6 py-3">
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className={isFetching && !isLoading ? "opacity-60 transition-opacity duration-300 pointer-events-none" : "transition-opacity duration-300"}>
            {data?.map((item, rowIndex) => (
              <TableRow key={`tr-${rowIndex}`}>
                {item.map((column, columnIndex) => (
                  <TableCell
                     key={`tc-${rowIndex}-${columnIndex}`}
                    className="px-6 py-3 whitespace-normal max-w-100 wrap-break-words"
                  >
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            ))}

            {data.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={header.length} className="py-12 text-center align-middle">
                  {emptyState ? emptyState : "Tidak ada data"}
                </TableCell>
              </TableRow>
            )}

            {isLoading &&
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <TableRow key={`skeleton-row-${rowIndex}`}>
                  {header.map((_, colIndex) => (
                    <TableCell key={`skeleton-col-${colIndex}`} className="px-6 py-4">
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>

      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="items-center hidden gap-2 md:flex">
          <Label>Limit:</Label>
          <Select
            value={String(currentLimit)}
            onValueChange={(value) => onChangeLimit(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder={currentLimit} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select Limit</SelectLabel>
                {LIMIT_LISTS.map((limit) => (
                  <SelectItem key={limit} value={String(limit)}>
                    {limit}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-center w-full md:w-auto md:justify-end">
          {totalPages > 1 && (
            <PaginationDataTable
              totalPages={totalPages}
              currentPage={currentPage}
              onChangePage={onChangePage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
