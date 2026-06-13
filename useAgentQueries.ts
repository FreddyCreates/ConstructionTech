import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type AgentActionLog,
  type AgentRecord,
  type MessageRecord,
  type SMSBridgeRecord,
  type SMSResult,
  type Variant_auditProject_chat_smsMessage_sendInvoice_sendAlert_sendPaymentLink_deployEstimate,
  createActor,
} from "../backend";
import type { ChatMessageResult } from "../backend";

export function useQueryAgentsForPrincipal() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<AgentRecord[]>({
    queryKey: ["agentsForPrincipal"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.queryAgentsForPrincipal();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000,
  });
}

export function useQueryAgentById(agentId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<AgentRecord | null>({
    queryKey: ["agent", agentId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.queryAgentById(agentId);
    },
    enabled: !!actor && !isFetching && !!agentId,
    refetchInterval: 10000,
  });
}

export function useCreateAgent() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      assignedSkills: string[];
      workspaceScope: string[];
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.createAgent(
        data.name,
        data.description,
        data.assignedSkills,
        data.workspaceScope,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agentsForPrincipal"] });
    },
  });
}

export function useUpdateAgent() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      agentId: string;
      name: string;
      description: string;
      assignedSkills: string[];
      workspaceScope: string[];
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.updateAgent(
        data.agentId,
        data.name,
        data.description,
        data.assignedSkills,
        data.workspaceScope,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agentsForPrincipal"] });
    },
  });
}

export function useDeleteAgent() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (agentId: string) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.deleteAgent(agentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agentsForPrincipal"] });
    },
  });
}

export function useActivateAgent() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (agentId: string) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.activateAgent(agentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agentsForPrincipal"] });
    },
  });
}

export function useDeactivateAgent() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (agentId: string) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.deactivateAgent(agentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agentsForPrincipal"] });
    },
  });
}

export function useLogAgentAction() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      agentId: string;
      actionType: Variant_auditProject_chat_smsMessage_sendInvoice_sendAlert_sendPaymentLink_deployEstimate;
      resultSummary: string;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.logAgentAction(
        data.agentId,
        data.actionType,
        data.resultSummary,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agentActionLog"] });
    },
  });
}

export function useQueryAgentActionLog() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<AgentActionLog[]>({
    queryKey: ["agentActionLog"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.queryAgentActionLog();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000,
  });
}

export function useQueryAgentActionLogForAgent(agentId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<AgentActionLog[]>({
    queryKey: ["agentActionLog", agentId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.queryAgentActionLogForAgent(agentId);
    },
    enabled: !!actor && !isFetching && !!agentId,
    refetchInterval: 10000,
  });
}

export function useRegisterSMSBridge() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (agentId: string) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.registerSMSBridge(agentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["smsBridge"] });
    },
  });
}

export function useDeactivateSMSBridge() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.deactivateSMSBridge();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["smsBridge"] });
    },
  });
}

export function useMeSendChatMessage() {
  const { actor } = useActor(createActor);
  return useMutation<
    ChatMessageResult,
    Error,
    { agentId: string; content: string }
  >({
    mutationFn: async ({ agentId, content }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.meSendChatMessage(agentId, content);
    },
  });
}

export function useMeGetMessageHistory(agentId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<MessageRecord[]>({
    queryKey: ["messageHistory", agentId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.meGetMessageHistory(agentId);
    },
    enabled: !!actor && !isFetching && !!agentId,
    refetchInterval: 6000,
  });
}

export function useMeSendSMSMessage() {
  const { actor } = useActor(createActor);
  return useMutation<
    SMSResult,
    Error,
    { agentId: string; toNumber: string; content: string }
  >({
    mutationFn: async ({ agentId, toNumber, content }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.meSendSMSMessage(agentId, toNumber, content);
    },
  });
}

export function useQuerySMSBridge() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<SMSBridgeRecord | null>({
    queryKey: ["smsBridge"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.querySMSBridge();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000,
  });
}
