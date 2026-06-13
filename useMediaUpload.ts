import { type MediaType, createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useCallback, useState } from "react";

export type { MediaType };

export interface UploadMediaParams {
  blob: Blob;
  sessionId: string;
  tenantId: string;
  uploaderName: string;
  uploaderRole: string;
  mediaType: MediaType;
  mimeType: string;
}

export interface UploadResult {
  mediaId: string;
  objectStorageUrl: string;
}

export function useMediaUpload() {
  const { actor } = useActor(createActor);
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (params: UploadMediaParams): Promise<UploadResult | null> => {
      if (!actor) {
        setError("Actor not ready");
        return null;
      }

      setIsUploading(true);
      setError(null);
      setProgress(0);

      try {
        const {
          blob,
          sessionId,
          tenantId,
          uploaderName,
          uploaderRole,
          mediaType,
          mimeType,
        } = params;
        const mediaId = crypto.randomUUID();

        // Simulate upload progress while posting to backend
        const simulateProgress = async () => {
          for (let p = 0; p <= 90; p += 10) {
            await new Promise<void>((r) => setTimeout(r, 60));
            setProgress(p);
          }
        };
        void simulateProgress();

        // Build a data URL as object storage placeholder
        const bytes = new Uint8Array(await blob.arrayBuffer());
        const base64 = btoa(
          String.fromCharCode(...bytes.slice(0, Math.min(bytes.length, 1024))),
        );
        const objectStorageUrl = `data:${mimeType};base64,${base64}`;

        await actor.uploadMedia(
          sessionId,
          tenantId,
          mediaId,
          uploaderName,
          uploaderRole,
          mediaType,
          objectStorageUrl,
          BigInt(blob.size),
          mimeType,
        );

        setProgress(100);
        return { mediaId, objectStorageUrl };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setError(message);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [actor],
  );

  return { upload, progress, isUploading, error };
}
