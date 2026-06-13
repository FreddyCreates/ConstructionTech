import { createActor } from "@/backend";
import type { Contact } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useListContacts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Contact[]>({
    queryKey: ["contacts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listContacts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListContactsByRole(role: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Contact[]>({
    queryKey: ["contacts", "role", role],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listContactsByRole(role);
    },
    enabled: !!actor && !isFetching && !!role,
  });
}

export function useSearchContacts(query: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Contact[]>({
    queryKey: ["contacts", "search", query],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchContacts(query);
    },
    enabled: !!actor && !isFetching && query.length > 1,
  });
}

export function useCreateContact() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone: string;
      primaryRole: string;
      secondaryRoles: string[];
      notes: string;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      const result = await actor.createContact(
        data.name,
        data.email,
        data.phone,
        data.primaryRole,
        data.secondaryRoles,
        data.notes,
      );
      if ("err" in result) throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

export function useUpdateContact() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      email: string;
      phone: string;
      primaryRole: string;
      secondaryRoles: string[];
      notes: string;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      const result = await actor.updateContact(
        data.id,
        data.name,
        data.email,
        data.phone,
        data.primaryRole,
        data.secondaryRoles,
        data.notes,
      );
      if ("err" in result) throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

export function useDeleteContact() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not initialized");
      const result = await actor.deleteContact(id);
      if ("err" in result) throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}
