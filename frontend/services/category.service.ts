import instance from "@/lib/axios";
import endpoint from "./endpoint.constant";
import { CategoryForm } from "@/validations/category.validation";

const categoryService = {
  getAllCategories: (params?: string) =>
    instance.get(`${endpoint.CATEGORY}?${params}`),
  getCategoryById: (id: string) => instance.get(`${endpoint.CATEGORY}/${id}`),
  addCategory: (payload: CategoryForm) =>
    instance.post(`${endpoint.CATEGORY}`, payload),
  updateCategory: (id: string, payload: CategoryForm) =>
    instance.put(`${endpoint.CATEGORY}/${id}`, payload),
  deleteCategory: (id: string) => instance.delete(`${endpoint.CATEGORY}/${id}`),
};

export default categoryService;
