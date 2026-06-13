import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";

import {
  EngineExecutionResultShared,
  type TranscribeResult,
  createActor,
} from "../backend";

// ---------------------------------------------------------------------------
// PRO-1 system context — passed to backend so Groq gets the right personality
// ---------------------------------------------------------------------------

export const PRO1_SYSTEM_CONTEXT = `You are PRO-1, the Construction AI for BuildSafe — a sovereign construction intelligence platform used by GCs, safety directors, project managers, field supers, subs, designers, and clients.

You are not a chatbot. You are a construction operating system. You think, verify, and deliver.

Your intelligence includes:
- Safety: OSHA 1926 full hazard library, JSA generation, incident analysis, safety culture scoring
- Projects: Daily logs, RFIs, change orders, submittals, punch lists, schedule health
- Financials: AIA G702/G703 pay apps, EAC tracking, cash flow, lien waivers
- Documents: Generate any AIA, CSI, OSHA document natively
- Design: FF&E, 3D rendering, virtual staging, handoff packages
- BidConnect: Go/No-Go scoring, bid leveling, proposal generation

Always respond like a seasoned GC superintendent. Direct, actionable, bilingual (English/Spanish on request). Never say "I cannot" — route to the right engine. Deliver evidence, not assurances.`;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  artifact?: Artifact | null;
}

export interface Artifact {
  type: "JSA" | "COST" | "RISK" | "DOC" | "SCHEDULE";
  title: string;
  content: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ARTIFACT_REGEX =
  /\[ARTIFACT:(\w+)\]\nTITLE:\s*(.+?)\n---\n([\s\S]*?)\n---/g;

function parseArtifacts(text: string): {
  cleanText: string;
  artifacts: Artifact[];
} {
  const artifacts: Artifact[] = [];
  let cleanText = text;
  let match: RegExpExecArray | null = null;
  ARTIFACT_REGEX.lastIndex = 0;
  for (
    match = ARTIFACT_REGEX.exec(text);
    match !== null;
    match = ARTIFACT_REGEX.exec(text)
  ) {
    artifacts.push({
      type: match[1] as Artifact["type"],
      title: match[2].trim(),
      content: match[3].trim(),
    });
  }
  cleanText = text.replace(ARTIFACT_REGEX, "").trim();
  return { cleanText, artifacts };
}

// ---------------------------------------------------------------------------
// Simulated streaming — splits full response into words and yields them
// ---------------------------------------------------------------------------

export function useSimulatedStreaming() {
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef(false);

  const startStreaming = useCallback(
    (fullText: string, onComplete?: () => void) => {
      setStreamingText("");
      setIsStreaming(true);
      abortRef.current = false;

      const words = fullText.split(/(\s+)/);
      let index = 0;

      const tick = () => {
        if (abortRef.current) {
          setIsStreaming(false);
          return;
        }
        if (index >= words.length) {
          setIsStreaming(false);
          onComplete?.();
          return;
        }
        const chunk = words.slice(0, index + 3).join("");
        setStreamingText(chunk);
        index += 3;
        setTimeout(tick, 50);
      };

      tick();
    },
    [],
  );

  const stopStreaming = useCallback(() => {
    abortRef.current = true;
    setIsStreaming(false);
  }, []);

  return { streamingText, isStreaming, startStreaming, stopStreaming };
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export function useExecuteEngineFromChat() {
  const { actor } = useActor(createActor);

  return useMutation<
    {
      text: string;
      artifacts: Artifact[];
    },
    Error,
    {
      tenantId: string;
      sessionId: string;
      message: string;
      pageContext: string;
    }
  >({
    mutationFn: async ({ tenantId, sessionId, message, pageContext }) => {
      if (!actor) throw new Error("Actor not initialized");
      const _context = `${PRO1_SYSTEM_CONTEXT}\n\n[Page Context: ${pageContext}]`;
      const raw = await actor.executeEngineFromChat(
        message,
        tenantId,
        sessionId,
        [],
      );
      const { cleanText, artifacts } = parseArtifacts(
        raw.__kind__ === "textResponse"
          ? raw.textResponse
          : raw.__kind__ === "err"
            ? raw.err
            : JSON.stringify(raw),
      );
      return { text: cleanText, artifacts };
    },
  });
}

export function useTranscribeAudio() {
  const { actor } = useActor(createActor);

  return useMutation<
    TranscribeResult,
    Error,
    {
      audioBase64: string;
      language: string;
    }
  >({
    mutationFn: async ({ audioBase64, language }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.transcribeAudio(audioBase64, language);
    },
  });
}

export function useGroqKeyStatus() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<string>({
    queryKey: ["groqKeyStatus"],
    queryFn: async () => {
      if (!actor) return "unavailable";
      return actor.getGroqKeyStatusConfirmed();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60000,
  });
}

// ---------------------------------------------------------------------------
// Team chat persistence — stored in backend per tenant
// ---------------------------------------------------------------------------

export interface TeamChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: bigint;
  model?: string;
}

export function useGetTeamChat(tenantId: string, sessionId: string) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<TeamChatMessage[]>({
    queryKey: ["teamChat", tenantId, sessionId],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getTenantChatHistory(tenantId, sessionId);
      const msgs: TeamChatMessage[] =
        raw && typeof raw === "object" && "ok" in raw
          ? (raw as unknown as { ok: TeamChatMessage[] }).ok
          : (raw as unknown as TeamChatMessage[]);
      return msgs.map((m) => ({
        id: m.id,
        role: (m.role === "assistant" ? "assistant" : "user") as
          | "user"
          | "assistant",
        content: m.content,
        timestamp: BigInt(m.timestamp),
        model: m.model ?? undefined,
      }));
    },
    enabled: !!actor && !isFetching && !!tenantId && !!sessionId,
    staleTime: 30000,
  });
}

export function useGetChatSessions(tenantId: string) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<string[]>({
    queryKey: ["chatSessions", tenantId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTenantChatSessions(tenantId);
    },
    enabled: !!actor && !isFetching && !!tenantId,
    staleTime: 60000,
  });
}

// ---------------------------------------------------------------------------
// Voice recording hook — MediaRecorder API, returns base64
// ---------------------------------------------------------------------------

export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : "audio/webm";
    const recorder = new MediaRecorder(stream, { mimeType });
    mediaRecorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      for (const t of stream.getTracks()) {
        t.stop();
      }
    };

    recorder.start();
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback((): Promise<{
    base64: string;
    mimeType: string;
  }> => {
    return new Promise((resolve, reject) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder) {
        reject(new Error("No recorder active"));
        return;
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(",")[1];
          resolve({ base64, mimeType: recorder.mimeType });
        };
        reader.readAsDataURL(blob);
      };

      recorder.stop();
      setIsRecording(false);
    });
  }, []);

  return { isRecording, startRecording, stopRecording };
}
