import BookCatalog from "./_components/BookCatalog";

export const metadata = {
  title: "Katalog Buku",
  description: "Temukan dan pinjam buku yang tersedia di perpustakaan",
};

export default function DashboardBooksPage() {
  return <BookCatalog />;
}
