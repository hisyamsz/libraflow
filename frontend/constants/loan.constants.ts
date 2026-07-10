import { RejectLoanForm, ReturnLoanForm } from "@/validations/loan.validation";
import { LoanStatus } from "@/types/Loan";

export const HEADER_TABLE_LOAN_MEMBER = [
  "No",
  "Buku",
  "Tanggal Pinjam",
  "Tenggat Waktu",
  "Status",
];

export const HEADER_TABLE_LOAN_ADMIN = [
  "No",
  "Buku",
  "Peminjam",
  "Tanggal Pinjam",
  "Tenggat Waktu",
  "Status",
  "Aksi",
];

export const INITIAL_RETURN_LOAN_FORM: ReturnLoanForm = {
  bookCondition: "GOOD",
  adminNote: "",
};

export const INITIAL_REJECT_LOAN_FORM: RejectLoanForm = {
  adminNote: "",
};

export const STATUS_STYLES: Record<LoanStatus, { label: string; className: string }> = {
  PENDING: {
    label: "Menunggu",
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  APPROVED: {
    label: "Disetujui",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  REJECTED: {
    label: "Ditolak",
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
  RETURNED: {
    label: "Dikembalikan",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700",
  },
};

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}

