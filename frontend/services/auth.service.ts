import instance from "@/lib/axios";
import endpoint from "./endpoint.constant";
import { LoginForm } from "@/validations/auth.validation";

const authService = {
  login: (payload: LoginForm) =>
    instance.post(`${endpoint.AUTH}/login`, payload),
  getProfileWithToken: (token: string) =>
    instance.get(`${endpoint.AUTH}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default authService;
