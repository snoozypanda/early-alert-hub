import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { Disaster, CreateDisasterInput, UpdateDisasterInput } from "@/types/api";
import { BaseGenericApiResponse } from "@/types/api";

// Fetch all disasters
export const getDisasters = async () => {
  const response = await api.get<BaseGenericApiResponse<Disaster[]>>("/disaster");
  return response.data.data;
};

// Fetch single disaster
export const getDisasterById = async (id: number) => {
  const response = await api.get<BaseGenericApiResponse<Disaster>>(`/disaster/${id}`);
  return response.data.data;
};

// Create disaster
export const createDisaster = async (data: CreateDisasterInput) => {
  const response = await api.post<BaseGenericApiResponse<Disaster>>("/disaster", data);
  return response.data.data;
};

// Update disaster
export const updateDisaster = async (id: number, data: UpdateDisasterInput) => {
  const response = await api.patch<BaseGenericApiResponse<Disaster>>(`/disaster/${id}`, data);
  return response.data.data;
};

// Delete disaster
export const deleteDisaster = async (id: number) => {
  await api.delete(`/disaster/${id}`);
};

// Query hooks
export const useDisastersQuery = () => {
  return useQuery({
    queryKey: ["disasters"],
    queryFn: getDisasters,
    retry: 1,
  });
};

export const useDisasterQuery = (id: number | null) => {
  return useQuery({
    queryKey: ["disaster", id],
    queryFn: () => getDisasterById(id!),
    enabled: !!id,
    retry: 1,
  });
};

// Mutation hooks
export const useCreateDisasterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDisaster,
    onSuccess: (data) => {
      queryClient.setQueryData(["disaster", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["disasters"] });
    },
  });
};

export const useUpdateDisasterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDisasterInput }) =>
      updateDisaster(id, data),
    onSuccess: (data) => {
      queryClient.setQueryData(["disaster", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["disasters"] });
    },
  });
};

export const useDeleteDisasterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDisaster,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disasters"] });
    },
  });
};
