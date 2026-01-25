import { TranslationKey } from "@/lib/mockData";
import {
  LayoutDashboard,
  AlertTriangle,
  Megaphone,
  BarChart3,
  Settings,
  ClipboardList,
  Package,
  Users,
  FileText,
} from "lucide-react";

export type Role =
  | "disaster-manager"
  | "incident-validator"
  | "response-team"
  | "administrator";

// Map backend API roles (uppercase) to UI roles (lowercase)
export const roleMap: Record<string, Role> = {
  // Exact matches
  "DISASTER-MANAGER": "disaster-manager",
  "INCIDENT-VALIDATOR": "incident-validator",
  "RESPONSE-TEAM": "response-team",
  "ADMINISTRATOR": "administrator",
  
  // Variations (with spaces instead of hyphens)
  "DISASTER MANAGER": "disaster-manager",
  "INCIDENT VALIDATOR": "incident-validator",
  "RESPONSE TEAM": "response-team",
  
  // Handle potential variations
  "USER": "disaster-manager", // Default fallback for generic USER role
};

/**
 * Convert backend role string to UI role
 * @param backendRole - Role from API (e.g., "INCIDENT VALIDATOR")
 * @returns UI role (e.g., "incident-validator") or undefined if not found
 */
export function normalizeRole(backendRole: string | undefined): Role | undefined {
  if (!backendRole) return undefined;
  
  const normalized = backendRole.trim().toUpperCase();
  return roleMap[normalized];
}
  

export interface RoleNavItem {
  route: string;
  labelKey: TranslationKey;
  icon: React.ElementType;
}

export const roleUI: Record<Role, RoleNavItem[]> = {
  "disaster-manager": [
    {
      route: "/dashboard",
      labelKey: "dashboard",
      icon: LayoutDashboard,
    },
    {
      route: "/alerts",
      labelKey: "broadcastAlert",
      icon: Megaphone,
    },
    {
      route: "/analytics",
      labelKey: "analytics",
      icon: BarChart3,
    },
    {
      route: "/settings",
      labelKey: "settings",
      icon: Settings,
    },
  ],

  "incident-validator": [
    {
      route: "/dashboard",
      labelKey: "dashboard",
      icon: LayoutDashboard,
    },
    {
      route: "/public-alerts",
      labelKey: "alerts",
      icon: AlertTriangle,
    },
    // {
    //   route: "/tasks",
    //   labelKey: "tasks",
    //   icon: ClipboardList,
    // },
    {
      route: "/incidents",
      labelKey: "incidents",
      icon: AlertTriangle,
    },
    {
      route: "/settings",
      labelKey: "settings",
      icon: Settings,
    },
  ],

  "response-team": [
    {
      route: "/dashboard",
      labelKey: "dashboard",
      icon: LayoutDashboard,
    },
    {
      route: "/alerts",
      labelKey: "alerts",
      icon: AlertTriangle,
    },
    {
      route: "/resources",
      labelKey: "resources",
      icon: Package,
    },
    {
      route: "/analytics",
      labelKey: "analytics",
      icon: BarChart3,
    },
    {
      route: "/settings",
      labelKey: "settings",
      icon: Settings,
    },
  ],

  administrator: [
    {
      route: "/dashboard",
      labelKey: "dashboard",
      icon: LayoutDashboard,
    },
    {
      route: "/users",
      labelKey: "users",
      icon: Users,
    },
    {
      route: "/logs",
      labelKey: "log",
      icon: FileText,
    },
    {
      route: "/settings",
      labelKey: "settings",
      icon: Settings,
    },
  ],
};
