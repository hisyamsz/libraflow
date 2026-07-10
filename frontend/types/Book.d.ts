export interface Book {
  id: number;
  title: string;
  author: string;
  publisher?: string | null;
  year?: number | null;
  isbn?: string | null;
  description?: string | null;
  stock: number;
  coverImage?: string | null;
  categoryId: number;
  category?: {
    id: number;
    name: string;
  };
}
