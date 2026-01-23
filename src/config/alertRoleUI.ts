import type { LucideIcon } from "lucide-react";
import { AlertTriangle, CircleUser, Box } from "lucide-react";
import type { Role } from "./roleUI";

export type AlertsRoleUIConfig = {
  title: string;
  description: string;
  showButton: boolean;
  buttonText?: string;
  buttonIcon?: LucideIcon;
  action?: "create-alert";
};

export const alertsRoleUI: Record<Role, AlertsRoleUIConfig> = {
  "disaster-manager": {
    title: "Alerts Management",
    description: "Create, broadcast, and resolve disaster alerts",
    showButton: true,
    buttonText: "Create New Alert",
    buttonIcon: AlertTriangle,
    action: "create-alert",
  },

  administrator: {
    title: "Alerts Administration",
    description: "Oversee all users and system logs",
    showButton: true,
    buttonText: "Create New User",
    buttonIcon: CircleUser,
    // action: "create-user",
  },

  "incident-validator": {
    title: "Alerts Validation",
    description: "Review, and validate reported alerts",
    showButton: true,
    buttonText: "Create New Alert",
    buttonIcon: AlertTriangle,
    action: "create-alert",
  },

  "response-team": {
    title: "Alerts Monitoring",
    description: "Assign Resource to alerts.",
    showButton: true,
    buttonText: "Add New Resource",
    buttonIcon: Box,
    action: "create-alert",
  },
};
