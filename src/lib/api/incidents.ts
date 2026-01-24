import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

export interface IncidentOutput {
  id: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  severityLevel: "low" | "medium" | "high" | "critical";
  attachments?: string[];
  reportDate: string;
  updatedAt: string;
  reportedBy: {
    id: string;
    name: string;
    username: string;
  };
}

export const getIncidents = async () => {
  const response = await api.get<{ data: IncidentOutput[] }>("/incident");
  return response.data.data;
};

export const useIncidentsQuery = () => {
  return useQuery({
    queryKey: ["incidents"],
    queryFn: getIncidents,
  });
};
