import React, { createContext, useContext, useState } from "react";
import { mockAlerts, Alert } from "@/lib/mockData";

type AlertsContextType = {
  alerts: Alert[];
  updateAlert: (updated: Alert) => void;
};

const AlertsContext = createContext<AlertsContextType | null>(null);

export const AlertsProvider = ({ children }: { children: React.ReactNode }) => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);

  const updateAlert = (updated: Alert) => {
    setAlerts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  return (
    <AlertsContext.Provider value={{ alerts, updateAlert }}>
      {children}
    </AlertsContext.Provider>
  );
};

export const useAlerts = () => {
  const ctx = useContext(AlertsContext);
  if (!ctx) throw new Error("useAlerts must be used inside AlertsProvider");
  return ctx;
};
