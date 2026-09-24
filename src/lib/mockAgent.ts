// Agent simulé — logique extraite de oh-matilda-—-ai-agent-chat/src/App.tsx:124-258
// Matching de scénarios, construction de réponse, tokenisation et streaming.
import { SCENARIOS, GENERIC_SCENARIO, matchScenario } from "@/constants/scenarios";
import type { AttachmentState, ToneType } from "@/types";

export const STREAM_DELAY_MS = 600;
export const TOKEN_INTERVAL_SEND = 16;
export const TOKEN_INTERVAL_REGEN = 18;

export function match(text: string): string | null {
  return matchScenario(text);
}

export function tokenize(text: string): string[] {
  return text.match(/<[^>]+>|&[#a-zA-Z0-9]+;|\S+\s*/g) || [text];
}

export function buildResponse(
  scId: string | undefined,
  userQuery: string,
  tone: ToneType,
  attachments: AttachmentState
): string {
  const prefix =
    attachments.photo || attachments.file
      ? tone === "formal"
        ? "I have reviewed the attachment. "
        : tone === "friendly"
          ? "Got the attachment — nice! "
          : "Attachment noted. "
      : "";

  if (scId && SCENARIOS[scId]) {
    return prefix + SCENARIOS[scId].r[tone];
  }
  const truncated = userQuery.length > 80 ? userQuery.slice(0, 80) + "…" : userQuery;
  return prefix + GENERIC_SCENARIO.r[tone].replace("{U}", truncated || "your request");
}

export function getFollowUps(scId?: string): string[] {
  return (scId && SCENARIOS[scId]?.fu) || GENERIC_SCENARIO.fu;
}

let streamTimer: number | null = null;

export function stopStream(): void {
  if (streamTimer !== null) {
    window.clearInterval(streamTimer);
    streamTimer = null;
  }
}

export interface StreamOptions {
  tokens: string[];
  intervalMs: number;
  onToken: (buffer: string) => void;
  onDone: () => void;
}

export interface StreamHandle {
  cancel: () => void;
}

export function streamResponse(opts: StreamOptions): StreamHandle {
  stopStream();
  let idx = 0;
  let buffer = "";

  const cancel = (): void => {
    if (streamTimer !== null) {
      window.clearInterval(streamTimer);
      streamTimer = null;
    }
  };

  streamTimer = window.setInterval(() => {
    if (idx < opts.tokens.length) {
      buffer += opts.tokens[idx];
      idx += 1;
      opts.onToken(buffer);
    } else {
      cancel();
      opts.onDone();
    }
  }, opts.intervalMs);

  return { cancel };
}
