import instance from "@/lib/axios";
import endpoint from "./endpoint.constant";
import { UserPayload, ChangePasswordPayload } from "@/types/User";

const userService = {
  getUsers: (params?: string) => 
    instance.get(`${endpoint.USER}?${params}`),
    
  createUser: (payload: UserPayload) => 
    instance.post(`${endpoint.USER}`, payload),
    
  updateUser: (id: number, payload: UserPayload) => 
    instance.put(`${endpoint.USER}/${id}`, payload),
    
  deleteUser: (id: number) => 
    instance.delete(`${endpoint.USER}/${id}`),
    
  resetPassword: (id: number) =>
    instance.patch(`${endpoint.USER}/${id}/reset-password`),
    
  changePassword: (payload: ChangePasswordPayload) =>
    instance.patch(`${endpoint.USER}/change-password`, payload),
    
  importUsers: (formData: FormData) => 
    instance.post(`${endpoint.USER}/import`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export default userService;
