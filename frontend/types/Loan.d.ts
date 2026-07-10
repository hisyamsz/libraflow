export interface LoanBook {
  id: number;
  title: string;
  author: string;
  coverImage?: string | null;
}

export interface LoanUser {
  id: number;
  name: string;
  email: string;
  nis?: string | null;
  class?: string | null;
}

export type LoanStatus = "PENDING" | "APPROVED" | "REJECTED" | "RETURNED";

export interface Loan {
  id: number;
  bookId: number;
  userId: number;
  loanDate: string;
  dueDate: string;
  returnDate?: string | null;
  status: LoanStatus;
  adminNote?: string | null;
  book: LoanBook;
  user: LoanUser;
  bookCondition?: "GOOD" | "DAMAGED" | "LOST" | null;
}
