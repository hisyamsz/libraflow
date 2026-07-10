export interface OverdueLoanAdmin {
  id: number;
  dueDate: string;
  user: {
    name: string;
    nis: string | null;
  };
  book: {
    title: string;
  };
}

export interface AdminStats {
  totalBooks: number;
  totalCategories: number;
  totalMembers: number;
  totalPendingLoans: number;
  totalActiveLoans: number;
  totalOverdueLoans: number;
  totalDamagedLoans: number;
  totalLostLoans: number;
  overdueLoans: OverdueLoanAdmin[];
}

export interface OverdueLoanMember {
  id: number;
  dueDate: string;
  book: {
    title: string;
    coverImage: string | null;
  };
}

export interface MemberStats {
  activeLoans: number;
  pendingLoans: number;
  returnedLoans: number;
  damagedReturns: number;
  lostReturns: number;
  overdueLoans: OverdueLoanMember[];
}
