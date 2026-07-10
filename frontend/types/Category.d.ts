import { ReactNode } from "react";

export interface Category {
  id: number;
  name: string;
  description?: string | null;
  actions?: ReactNode;
}

export interface CategoryInput {
  name: string;
  description?: string;
}
