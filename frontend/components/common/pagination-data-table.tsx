import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

interface PaginationDataTableProps {
  totalPages: number;
  currentPage: number;
  onChangePage: (page: number) => void;
}

export default function PaginationDataTable({
  totalPages,
  currentPage,
  onChangePage,
}: PaginationDataTableProps) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={
              currentPage <= 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
            onClick={() => {
              if (currentPage > 1) {
                onChangePage(currentPage - 1);
              }
            }}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }).map((_, index) => {
          const page = index + 1;
          if (
            page === 1 ||
            page === totalPages ||
            Math.abs(currentPage - page) <= 1
          ) {
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  className="cursor-pointer"
                  isActive={page === currentPage}
                  onClick={() => {
                    if (page !== currentPage) onChangePage(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          }

          if (
            (page === currentPage - 2 && page > 1) ||
            (page === currentPage + 2 && page < totalPages)
          ) {
            return (
              <PaginationItem key={`ellipsis-${page}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return null;
        })}

        <PaginationItem>
          <PaginationNext
            className={
              currentPage >= totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
            onClick={() => {
              if (currentPage < totalPages) {
                onChangePage(currentPage + 1);
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
