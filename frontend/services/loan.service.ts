import instance from "@/lib/axios";
import endpoint from "./endpoint.constant";

const loanService = {
  getLoans: (params?: string) =>
    instance.get(`${endpoint.LOAN}${params ? `?${params}` : ""}`),
  getMyLoans: (params?: string) =>
    instance.get(`${endpoint.LOAN}/my${params ? `?${params}` : ""}`),
  submitLoan: (bookId: number) =>
    instance.post(`${endpoint.LOAN}`, { bookId }),
  approveLoan: (id: number) =>
    instance.patch(`${endpoint.LOAN}/${id}/approve`),
  rejectLoan: (id: number, adminNote: string) =>
    instance.patch(`${endpoint.LOAN}/${id}/reject`, { adminNote }),
  returnLoan: (id: number, payload: { bookCondition: string; adminNote?: string }) =>
    instance.patch(`${endpoint.LOAN}/${id}/return`, payload),
};

export default loanService;
