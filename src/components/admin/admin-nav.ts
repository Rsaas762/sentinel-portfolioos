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

interface AdminNavItem {
  href: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
  exact?: boolean;
}

export const ADMIN_NAV: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", Icon: FolderKanban },
  { href: "/admin/skills", label: "Skills", Icon: Sparkles },
  { href: "/admin/experience", label: "Experience", Icon: Briefcase },
  { href: "/admin/certifications", label: "Certifications", Icon: Award },
  { href: "/admin/testimonials", label: "Testimonials", Icon: MessageSquareQuote },
  { href: "/admin/messages", label: "Messages", Icon: Inbox },
  { href: "/admin/settings", label: "Settings", Icon: Settings },
];
