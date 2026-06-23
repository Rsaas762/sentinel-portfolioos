import type { ComponentType } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  Briefcase,
  Award,
  MessageSquareQuote,
  Inbox,
  Settings,
} from "lucide-react";

export interface AdminNavItem {
  href: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
  exact?: boolean;
}

export interface AdminNavGroup {
  label: string | null;
  items: AdminNavItem[];
}

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    label: null,
    items: [
      { href: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/projects", label: "Projects", Icon: FolderKanban },
      { href: "/admin/skills", label: "Skills", Icon: Sparkles },
      { href: "/admin/experience", label: "Experience", Icon: Briefcase },
      { href: "/admin/certifications", label: "Certifications", Icon: Award },
      {
        href: "/admin/testimonials",
        label: "Testimonials",
        Icon: MessageSquareQuote,
      },
    ],
  },
  {
    label: "Workspace",
    items: [
      { href: "/admin/messages", label: "Messages", Icon: Inbox },
      { href: "/admin/settings", label: "Settings", Icon: Settings },
    ],
  },
];

/** Flat list for any consumer that needs every item. */
export const ADMIN_NAV: AdminNavItem[] = ADMIN_NAV_GROUPS.flatMap(
  (g) => g.items,
);
