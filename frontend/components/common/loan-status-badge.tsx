import { LoanStatus } from "@/types/Loan";
import { STATUS_STYLES } from "@/constants/loan.constants";
import { Badge } from "@/components/ui/badge";

interface LoanStatusBadgeProps {
  status: LoanStatus;
  condition?: "GOOD" | "DAMAGED" | "LOST" | null;
}

export default function LoanStatusBadge({ status, condition }: LoanStatusBadgeProps) {
  let style = STATUS_STYLES[status] ?? STATUS_STYLES.PENDING;

  if (status === "RETURNED" && condition) {
    if (condition === "DAMAGED") {
      style = {
        ...style,
        label: "Rusak",
        className:
          "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-700",
      };
    } else if (condition === "LOST") {
      style = {
        ...style,
        label: "Hilang",
        className:
          "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border border-red-200 dark:border-red-700",
      };
    } else if (condition === "GOOD") {
      style = {
        ...style,
        label: "Dikembalikan",
      };
    }
  }

  return (
    <Badge className={style.className}>
      {style.label}
    </Badge>
  );
}

