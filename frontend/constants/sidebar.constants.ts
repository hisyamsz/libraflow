import {
  LayoutDashboard,
  BookOpen,
  BookMarked,
  ArrowLeftRight,
  Users,
  Tag,
  BookCopy,
} from "lucide-react";

import { LucideIcon } from "lucide-react";

export type SidebarItem = {
  title: string;
  icon: LucideIcon;
  href: string;
};

export type SidebarGroup = {
  label: string;
  items: SidebarItem[];
};

export const SIDEBAR_MEMBER: SidebarGroup[] = [
  {
    label: "Menu",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
      },
      {
        title: "Katalog Buku",
        icon: BookOpen,
        href: "/dashboard/books",
      },
      {
        title: "Peminjaman Saya",
        icon: BookMarked,
        href: "/dashboard/loans",
      },
    ],
  },
];

export const SIDEBAR_ADMIN: SidebarGroup[] = [
  {
    label: "Operasional",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin",
      },
      {
        title: "Peminjaman",
        icon: ArrowLeftRight,
        href: "/admin/loans",
      },
    ],
  },
  {
    label: "Data Master",
    items: [
      {
        title: "Buku",
        icon: BookCopy,
        href: "/admin/books",
      },
      {
        title: "Kategori",
        icon: Tag,
        href: "/admin/categories",
      },
      {
        title: "Pengguna",
        icon: Users,
        href: "/admin/users",
      },
    ],
  },
];
