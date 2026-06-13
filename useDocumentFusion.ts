import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type Variant_rfi_closeoutPackage_submittal_contract_invoice_estimate_punchList_scopeLetter,
  createActor,
} from "../backend";
import type { VirtualDocument } from "../backend";

export function useVirtualDocuments() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<VirtualDocument[]>({
    queryKey: ["virtualDocuments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.queryVirtualDocuments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useVirtualDocument(docId: string | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<VirtualDocument | null>({
    queryKey: ["virtualDocument", docId],
    queryFn: async () => {
      if (!actor || !docId) return null;
      return actor.queryVirtualDocumentById(docId);
    },
    enabled: !!actor && !isFetching && !!docId,
  });
}

export function useStoreVirtualDocument() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      docType:
        | "contract"
        | "scopeLetter"
        | "estimate"
        | "invoice"
        | "rfi"
        | "submittal"
        | "punchList"
        | "closeoutPackage";
      originalFileName: string;
      parsedSections: Array<{ sectionName: string; sectionContent: string }>;
      templateVersion: string;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.storeVirtualDocument(
        params.docType as Variant_rfi_closeoutPackage_submittal_contract_invoice_estimate_punchList_scopeLetter,
        params.originalFileName,
        params.parsedSections,
        params.templateVersion,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["virtualDocuments"] });
    },
  });
}

export function useUpdateVirtualDocument() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      docId: string;
      parsedSections: Array<{ sectionName: string; sectionContent: string }>;
      templateVersion: string;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateVirtualDocument(
        params.docId,
        params.parsedSections,
        params.templateVersion,
      );
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["virtualDocuments"] });
      queryClient.invalidateQueries({
        queryKey: ["virtualDocument", vars.docId],
      });
    },
  });
}

export function useGrantAgentAccess() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { docId: string; agentPrincipal: string }) => {
      if (!actor) throw new Error("Not authenticated");
      const { Principal } = await import("@icp-sdk/core/principal");
      return actor.grantAgentDocumentAccess(
        params.docId,
        Principal.fromText(params.agentPrincipal),
      );
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["virtualDocument", vars.docId],
      });
    },
  });
}

export function useRevokeAgentAccess() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { docId: string; agentPrincipal: string }) => {
      if (!actor) throw new Error("Not authenticated");
      const { Principal } = await import("@icp-sdk/core/principal");
      return actor.revokeAgentDocumentAccess(
        params.docId,
        Principal.fromText(params.agentPrincipal),
      );
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["virtualDocument", vars.docId],
      });
    },
  });
}
