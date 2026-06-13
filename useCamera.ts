import { useCallback, useEffect, useRef, useState } from "react";

export interface UseCameraReturn {
  stream: MediaStream | null;
  isRecording: boolean;
  startRecording: (onData?: (blob: Blob) => void) => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  capturePhoto: () => Promise<Blob | null>;
  error: string | null;
  hasPermission: boolean | null;
  requestPermission: () => Promise<boolean>;
  stopStream: () => void;
}

export function useCamera(): UseCameraReturn {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const resolveStopRef = useRef<((blob: Blob | null) => void) | null>(null);

  const stopStream = useCallback(() => {
    if (stream) {
      for (const t of stream.getTracks()) {
        t.stop();
      }
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      if (stream) {
        for (const t of stream.getTracks()) {
          t.stop();
        }
      }
    };
  }, [stream]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    setError(null);
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: true,
      };
      const s = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(s);
      setHasPermission(true);
      return true;
    } catch (err) {
      const msg =
        err instanceof DOMException
          ? err.name === "NotAllowedError" ||
            err.name === "PermissionDeniedError"
            ? "Camera permission denied. Please allow camera access and try again."
            : err.name === "NotFoundError"
              ? "No camera device found on this device."
              : err.name === "NotReadableError"
                ? "Camera is already in use by another application."
                : `Camera error: ${err.message}`
          : "Unable to access camera.";
      setError(msg);
      setHasPermission(false);
      return false;
    }
  }, []);

  const capturePhoto = useCallback(async (): Promise<Blob | null> => {
    if (!stream) {
      setError("Camera stream is not active. Request permission first.");
      return null;
    }
    const videoTrack = stream.getVideoTracks()[0];
    if (!videoTrack) {
      setError("No video track available.");
      return null;
    }

    // Use ImageCapture API when available, fall back to canvas
    if (typeof ImageCapture !== "undefined") {
      try {
        const capture = new ImageCapture(videoTrack);
        const blob = await capture.takePhoto({
          imageWidth: 1920,
          imageHeight: 1080,
        });
        return blob;
      } catch {
        // Fall through to canvas fallback
      }
    }

    // Canvas fallback — attach hidden video element
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.srcObject = new MediaStream([videoTrack]);
      video.autoplay = true;
      video.playsInline = true;
      video.muted = true;

      video.onloadedmetadata = () => {
        video.play().then(() => {
          requestAnimationFrame(() => {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth || 1280;
            canvas.height = video.videoHeight || 720;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              resolve(null);
              return;
            }
            ctx.drawImage(video, 0, 0);
            canvas.toBlob(
              (blob) => {
                video.srcObject = null;
                resolve(blob);
              },
              "image/jpeg",
              0.92,
            );
          });
        });
      };
      video.onerror = () => resolve(null);
    });
  }, [stream]);

  const startRecording = useCallback(
    async (onData?: (blob: Blob) => void): Promise<void> => {
      if (!stream) {
        setError("Camera stream is not active. Request permission first.");
        return;
      }
      if (isRecording) return;

      recordedChunksRef.current = [];
      setError(null);

      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
          onData?.(e.data);
        }
      };

      recorder.onstop = () => {
        const chunks = recordedChunksRef.current;
        const blob =
          chunks.length > 0
            ? new Blob(chunks, { type: mimeType || "video/webm" })
            : null;
        setIsRecording(false);
        if (resolveStopRef.current) {
          resolveStopRef.current(blob);
          resolveStopRef.current = null;
        }
      };

      recorder.onerror = () => {
        setError("Recording failed. Please try again.");
        setIsRecording(false);
      };

      recorder.start(1000); // collect data every second for streaming
      setIsRecording(true);
    },
    [stream, isRecording],
  );

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") return null;

    return new Promise((resolve) => {
      resolveStopRef.current = resolve;
      recorder.stop();
    });
  }, []);

  return {
    stream,
    isRecording,
    startRecording,
    stopRecording,
    capturePhoto,
    error,
    hasPermission,
    requestPermission,
    stopStream,
  };
}

// ─── helpers ────────────────────────────────────────────────────────────────

function getSupportedMimeType(): string | null {
  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
    "video/mp4;codecs=h264,aac",
    "video/mp4",
  ];
  for (const type of candidates) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return null;
}
