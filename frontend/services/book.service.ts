import instance from "@/lib/axios";
import endpoint from "./endpoint.constant";
import { BookPayload } from "@/validations/book.validation";

const bookService = {
  getAllBooks: (params?: string) =>
    instance.get(`${endpoint.BOOK}?${params}`),
  getBookById: (id: string) => instance.get(`${endpoint.BOOK}/${id}`),
  addBook: (payload: BookPayload) => instance.post(`${endpoint.BOOK}`, payload),
  updateBook: (id: string, payload: BookPayload) =>
    instance.put(`${endpoint.BOOK}/${id}`, payload),
  deleteBook: (id: string) => instance.delete(`${endpoint.BOOK}/${id}`),
};

export default bookService;
