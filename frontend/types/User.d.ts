import { ReactNode } from "react";

export interface User {
  id: number;
  name: string;
  email: string | null;
  nis: string;
  phone: string | null;
  role: "ADMIN" | "MEMBER";
  class: string | null;
  createdAt: string;
  updatedAt: string;
  actions?: ReactNode;
}

export interface UserFormInput {
  name: string;
  nis: string;
  role: "ADMIN" | "MEMBER";
  email?: string;
  phone?: string;
  password?: string;
  class?: string;
}

// Payload yang dikirim ke API (mengonversi string kosong menjadi null untuk backend)
export interface UserPayload {
  name: string;
  nis: string;
  role: "ADMIN" | "MEMBER";
  email: string | null;
  phone: string | null;
  password?: string;
  class?: string | null;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
