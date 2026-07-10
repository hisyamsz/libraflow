import { Check, X, Undo2 } from "lucide-react";

import { Loan } from "@/types/Loan";
import DropdownAction from "@/components/common/dropdown-action";

interface LoanActionCellProps {
  loan: Loan;
  onAction: (data: Loan, type: "approve" | "reject" | "return") => void;
}

export default function LoanActionCell({ loan, onAction }: LoanActionCellProps) {
  if (loan.status === "RETURNED" || loan.status === "REJECTED") {
    return (
      <span className="text-muted-foreground text-xs">-</span>
    );
  }

  const menu =
    loan.status === "PENDING"
      ? [
          {
            label: (
              <span className="flex items-center gap-2">
                <Check className="animate-in fade-in zoom-in-50 h-4 w-4 text-green-600 duration-200" />
                Setujui
              </span>
            ),
            action: () => onAction(loan, "approve"),
          },
          {
            label: (
              <span className="flex items-center gap-2">
                <X className="animate-in fade-in zoom-in-50 h-4 w-4 text-red-600 duration-200" />
                Tolak
              </span>
            ),
            action: () => onAction(loan, "reject"),
            variant: "destructive" as const,
          },
        ]
      : [
          {
            label: (
              <span className="flex items-center gap-2">
                <Undo2 className="animate-in fade-in zoom-in-50 h-4 w-4 text-indigo-600 duration-200" />
                Kembalikan Buku
              </span>
            ),
            action: () => onAction(loan, "return"),
          },
        ];

  return <DropdownAction menu={menu} />;
}
