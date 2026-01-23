import { Megaphone, X, Eye, Edit, Plus } from "lucide-react";
import { Label } from "recharts";

export type AlertAction =
  | "broadcast"
  | "view"
  | "edit"
  | "resolve"
  | "add-resource";

export interface AlertActionConfig {
  action: AlertAction;
  label: string;
  icon: React.ElementType;
}

export const alertActionsByRole = {
  "disaster-manager": [
    {
      action: "broadcast",
      label: "Broadcast Alert",
      icon: Megaphone,
    },
    {
      action: "resolve",
      label: "Close Alert",
      icon: X,
    },
  ],

  "incident-validator": [
    {
      action: "view",
      label: "View",
      icon: Eye,
    },
    {
      action: "edit",
      label: "Edit",
      icon: Edit,
    },
    {
      action: "resolve",
      label: "Reject",
      icon: X,
    },
  ],

  "response-team": [
    {
      action: "add-resource",
      label: "Add Resource",
      icon: Plus,
    },
  ],
  administrator: [
    {
      action: "create-user",
      Label: "Create User",
      icon: Plus,
    },
  ],
} as const;
