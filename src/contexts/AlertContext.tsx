import React, { createContext, useContext, useState } from "react";
import { mockAlerts, Alert, Incident } from "@/lib/mockData";

type AlertsContextType = {
  alerts: Alert[];
  updateAlert: (updated: Alert) => void;
  createAlertFromIncident: (incident: Incident) => void;
};

const AlertsContext = createContext<AlertsContextType | null>(null);

export const AlertsProvider = ({ children }: { children: React.ReactNode }) => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);

  // ✅ Update existing alert
  const updateAlert = (updated: Alert) => {
    setAlerts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  // ✅ Create alert from APPROVED incident
  const createAlertFromIncident = (incident: Incident) => {
    // Safety check
    if (incident.status !== "approved") return;

    const newAlert: Alert = {
      id: crypto.randomUUID(),
      type: incident.type, // ✔ same field
      area: incident.location, // ✔ mapping
      severity: mapPriorityToSeverity(incident.priority),
      status: "active",
      date: incident.date,
      description: incident.description,
      createdAt: new Date().toISOString(),
    };

    setAlerts((prev) => [newAlert, ...prev]);
  };

  return (
    <AlertsContext.Provider
      value={{ alerts, updateAlert, createAlertFromIncident }}
    >
      {children}
    </AlertsContext.Provider>
  );
};

export const useAlerts = () => {
  const ctx = useContext(AlertsContext);
  if (!ctx) throw new Error("useAlerts must be used inside AlertsProvider");
  return ctx;
};

// 🔁 Helper mapper (VERY important)
const mapPriorityToSeverity = (
  priority: Incident["priority"],
): Alert["severity"] => {
  switch (priority) {
    case "low":
      return "low";
    case "medium":
      return "medium";
    case "high":
      return "high";
    default:
      return "low";
  }
};
