import { Info, FileText } from "lucide-react";

import { Loan } from "@/types/Loan";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import LoanStatusBadge from "./loan-status-badge";

interface LoanStatusCellProps {
  loan: Loan;
}

export default function LoanStatusCell({ loan }: LoanStatusCellProps) {
  return (
    <div className="flex items-center gap-2">
      <LoanStatusBadge status={loan.status} condition={loan.bookCondition} />

      {loan.status === "REJECTED" && (
        <Popover>
          <PopoverTrigger asChild>
            <Info className="text-destructive hover:text-destructive/80 h-4 w-4 shrink-0 cursor-pointer transition-colors" />
          </PopoverTrigger>
          <PopoverContent
            className="animate-in fade-in zoom-in-95 w-64 p-3 duration-100"
            align="start"
          >
            <p className="text-destructive mb-1 text-xs font-semibold">
              Alasan Penolakan
            </p>
            <p className="text-muted-foreground text-xs leading-snug">
              {loan.adminNote || "Tidak ada catatan tambahan."}
            </p>
          </PopoverContent>
        </Popover>
      )}

      {loan.status === "RETURNED" && (
        <Popover>
          <PopoverTrigger asChild>
            <FileText className="text-muted-foreground hover:text-foreground h-4 w-4 shrink-0 cursor-pointer transition-colors" />
          </PopoverTrigger>
          <PopoverContent
            className="animate-in fade-in zoom-in-95 w-72 p-3 duration-100"
            align="start"
          >
            <p className="text-foreground mb-2 border-b pb-1 text-xs font-semibold">
              Detail Pengembalian
            </p>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-muted-foreground">Kondisi:</span>
                {loan.bookCondition === "GOOD" || !loan.bookCondition ? (
                  <span className="font-semibold text-green-600">
                    Bagus / Lengkap
                  </span>
                ) : loan.bookCondition === "DAMAGED" ? (
                  <span className="font-semibold text-amber-600">Rusak</span>
                ) : (
                  <span className="font-semibold text-red-600">Hilang</span>
                )}
              </div>
              <div className="flex flex-col gap-1 text-xs">
                <span className="text-muted-foreground">Catatan Petugas:</span>
                <p className="text-muted-foreground bg-muted mt-0.5 rounded-md p-2 leading-relaxed whitespace-pre-wrap">
                  {loan.adminNote || (
                    <span className="italic">Tidak ada catatan tambahan.</span>
                  )}
                </p>
                </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
