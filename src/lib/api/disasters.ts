import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

export interface DisasterOutput {
  id: string;
  title: string;
  description: string;
  severityLevel: "low" | "medium" | "high" | "critical";
  scope: string;
  attachments?: string[];
  affectedPopulation: number;
  status: "active" | "monitoring" | "resolved";
  startDate: string;
  createdAt: string;
  updatedAt: string;
  issuedBy: {
    id: string;
    name: string;
    username: string;
  };
  verifiedIncident?: string;
}

export const getDisasters = async () => {
  const response = await api.get<{ data: DisasterOutput[] }>("/disaster");
  return response.data.data;
};

export const useDisastersQuery = () => {
  return useQuery({
    queryKey: ["disasters"],
    queryFn: getDisasters,
  });
};
