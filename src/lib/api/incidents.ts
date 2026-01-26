import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { Incident, CreateIncidentInput, UpdateIncidentInput } from "@/types/api";
import { BaseGenericApiResponse } from "@/types/api";

// Fetch all incidents
export const getIncidents = async () => {
  const response = await api.get<BaseGenericApiResponse<Incident[]>>("/incident");
  return response.data.data;
};

// Fetch single incident
export const getIncidentById = async (id: number) => {
  const response = await api.get<BaseGenericApiResponse<Incident>>(`/incident/${id}`);
  return response.data.data;
};

// Create incident
export const createIncident = async (data: CreateIncidentInput) => {
  const response = await api.post<BaseGenericApiResponse<Incident>>("/incident", data);
  return response.data.data;
};

// Update incident
export const updateIncident = async (id: number, data: UpdateIncidentInput) => {
  const response = await api.patch<BaseGenericApiResponse<Incident>>(`/incident/${id}`, data);
  return response.data.data;
};

// Delete incident
export const deleteIncident = async (id: number) => {
  await api.delete(`/incident/${id}`);
};

// Query hooks
export const useIncidentsQuery = () => {
  return useQuery({
    queryKey: ["incidents"],
    queryFn: getIncidents,
    retry: 1,
  });
};

export const useIncidentQuery = (id: number | null) => {
  return useQuery({
    queryKey: ["incident", id],
    queryFn: () => getIncidentById(id!),
    enabled: !!id,
    retry: 1,
  });
};

// Mutation hooks
export const useCreateIncidentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createIncident,
    onSuccess: (data) => {
      queryClient.setQueryData(["incident", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
    },
  });
};

export const useUpdateIncidentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateIncidentInput }) =>
      updateIncident(id, data),
    onSuccess: (data) => {
      queryClient.setQueryData(["incident", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
    },
  });
};

export const useDeleteIncidentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
    },
  });
};
