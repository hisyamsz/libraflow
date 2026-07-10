export const HEADER_TABLE_BOOK = [
  "No",
  "Cover",
  "Judul",
  "ISBN",
  "Penulis",
  "Penerbit",
  "Tahun",
  "Kategori",
  "Stok",
  "Aksi",
];

export const INITIAL_BOOK_FORM = {
  title: "",
  author: "",
  publisher: "",
  year: String(new Date().getFullYear()),
  isbn: "",
  description: "",
  stock: "1",
  coverImage: "",
  categoryId: 0,
};
