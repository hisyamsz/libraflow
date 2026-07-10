import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatRole(role?: string | null): string {
  if (!role) return "";
  if (role.toUpperCase() === "MEMBER") return "Anggota";
  if (role.toUpperCase() === "ADMIN") return "Admin";
  return role;
}

export function getGoogleDriveDirectLink(url?: string | null): string {
  if (!url) return "";
  
  // Regex untuk mencocokkan berbagai format link sharing Google Drive dan mengambil File ID
  const driveRegex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=|uc\?export=view&id=|thumbnail\?id=)|docs\.google\.com\/(?:file\/d\/))([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);
  
  if (match && match[1]) {
    const fileId = match[1];
    // Menggunakan endpoint thumbnail dengan ukuran lebar maksimal 1000px agar render di img/Next.js Image lancar dan hemat bandwidth
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  }
  
  return url;
}
