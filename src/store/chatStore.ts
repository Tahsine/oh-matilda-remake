// Store central — état complet + actions (phase 3).
// Remplace les useState du App.tsx phase 2.
// Sync conversations (fix vs ref) : la 1re send dans un chat vide crée la
// conversation, et chaque envoi est resynchronisé dedans.
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { INITIAL_CONVERSATIONS } from "@/constants/scenarios";
import {
  STREAM_DELAY_MS,
  TOKEN_INTERVAL_REGEN,
  TOKEN_INTERVAL_SEND,
  buildResponse,
  getFollowUps,
  match,
  stopStream,
  streamResponse,
  tokenize,
} from "@/lib/mockAgent";
import type {
  AttachmentState,
  ChatMessage,
  ConversationHistoryItem,
  DevicePerms,
  ToneType,
} from "@/types";

export type Theme = "light" | "dark";

interface PendingStream {
  aiMsgId: string;
  target: string;
  convId: string;
}

const now = (): string =>
  new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

let toastTimer: number | null = null;
let permTimer: number | null = null;
let streamDelayTimer: number | null = null;

const finalizeMessage = (list: ChatMessage[], p: PendingStream): ChatMessage[] =>
  list.map((m) =>
    m.id === p.aiMsgId ? { ...m, rawText: p.target, isStreaming: false } : m
  );

const clearStreamTimers = (): void => {
  stopStream();
  if (streamDelayTimer !== null) {
    window.clearTimeout(streamDelayTimer);
    streamDelayTimer = null;
  }
};

interface ChatState {
  theme: Theme;
  toast: string | null;
  messages: ChatMessage[];
  conversations: ConversationHistoryItem[];
  activeConvId: string | null;
  lastScId: string | undefined;
  input: string;
  attachments: AttachmentState;
  tone: ToneType;
  webEnabled: boolean;
  isStreaming: boolean;
  pending: PendingStream | null;
  followUpOpen: boolean;
  followUpQuestions: string[];
  voiceOpen: boolean;
  accessOpen: boolean;
  perms: DevicePerms;
  kebabOpen: boolean;
  sheetOpen: boolean;
  listOpen: boolean;

  toggleTheme: () => void;
  showToast: (message: string) => void;
  setInput: (value: string) => void;
  attach: (type: "photo" | "file") => void;
  removeAttachment: (type: "photo" | "file") => void;
  toggleWeb: () => void;
  setTone: (tone: ToneType) => void;
  toggleKebab: () => void;
  closeKebab: () => void;
  openSheet: () => void;
  closeSheet: () => void;
  openVoice: () => void;
  closeVoice: () => void;
  openAccess: () => void;
  closeAccess: () => void;
  continueAccess: () => void;
  openList: () => void;
  closeList: () => void;
  openFollowUp: (scId?: string) => void;
  closeFollowUp: () => void;
  enablePerm: (key: keyof DevicePerms) => void;
  sendMessage: (text?: string, att?: AttachmentState) => void;
  regenerate: (aiMsgId: string) => void;
  selectConversation: (conv: ConversationHistoryItem) => void;
  newChat: () => void;
  toggleFav: (convId: string) => void;
  deleteConversation: (convId: string) => void;
}

type FinalizedSlice = Partial<
  Pick<ChatState, "messages" | "conversations" | "pending" | "isStreaming">
>;

const withPendingFinalized = (s: ChatState): FinalizedSlice => {
  if (!s.pending) return {};
  const p = s.pending;
  return {
    messages: finalizeMessage(s.messages, p),
    conversations: s.conversations.map((c) =>
      c.id === p.convId ? { ...c, messages: finalizeMessage(c.messages, p) } : c
    ),
    pending: null,
    isStreaming: false,
  };
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      theme: "light",
      toast: null,
      messages: [],
      conversations: INITIAL_CONVERSATIONS,
      activeConvId: null,
      lastScId: undefined,
      input: "",
      attachments: { photo: false, file: false },
      tone: "formal",
      webEnabled: false,
      isStreaming: false,
      pending: null,
      followUpOpen: false,
      followUpQuestions: [],
      voiceOpen: false,
      accessOpen: false,
      perms: { a11y: false, capture: false },
      kebabOpen: false,
      sheetOpen: false,
      listOpen: false,

  toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),

  showToast: (message) => {
    if (toastTimer !== null) window.clearTimeout(toastTimer);
    set({ toast: message });
    toastTimer = window.setTimeout(() => set({ toast: null }), 2200);
  },

  setInput: (value) => set({ input: value }),

  attach: (type) =>
    set((s) => ({ attachments: { ...s.attachments, [type]: true } })),

  removeAttachment: (type) =>
    set((s) => ({ attachments: { ...s.attachments, [type]: false } })),

  toggleWeb: () => {
    const next = !get().webEnabled;
    set({ webEnabled: next });
    get().showToast(next ? "Web search on" : "Web search off");
  },

  setTone: (tone) => {
    set({ tone });
    get().showToast(`Tone set to ${tone}`);
  },

  toggleKebab: () => set((s) => ({ kebabOpen: !s.kebabOpen })),
  closeKebab: () => set({ kebabOpen: false }),
  openSheet: () => set({ sheetOpen: true }),
  closeSheet: () => set({ sheetOpen: false }),
  openVoice: () => set({ voiceOpen: true }),
  closeVoice: () => set({ voiceOpen: false }),
  openAccess: () => set({ accessOpen: true }),
  closeAccess: () => set({ accessOpen: false }),
  continueAccess: () => {
    set({ accessOpen: false });
    get().showToast("Oh-Matilda can now act on your phone");
  },
  openList: () => set({ listOpen: true }),
  closeList: () => set({ listOpen: false }),

  openFollowUp: (scId) =>
    set({ followUpQuestions: getFollowUps(scId), followUpOpen: true }),
  closeFollowUp: () => set({ followUpOpen: false }),

  enablePerm: (key) => {
    get().showToast("Opening Android settings (simulated)");
    if (permTimer !== null) window.clearTimeout(permTimer);
    permTimer = window.setTimeout(() => {
      set((s) => ({ perms: { ...s.perms, [key]: true } }));
      get().showToast(key === "a11y" ? "Accessibility granted" : "Screen capture granted");
    }, 550);
  },

  sendMessage: (text, att) => {
    const s = get();
    const trimmed = (text ?? s.input).trim();
    const curAtt = att ?? s.attachments;
    if (!trimmed && !curAtt.photo && !curAtt.file) return;

    let baseMessages = s.messages;
    let baseConvs = s.conversations;
    if (s.pending) {
      const p = s.pending;
      baseMessages = finalizeMessage(baseMessages, p);
      baseConvs = baseConvs.map((c) =>
        c.id === p.convId ? { ...c, messages: finalizeMessage(c.messages, p) } : c
      );
    }

    const timeStr = now();
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: trimmed || undefined,
      attachments: curAtt.photo || curAtt.file ? { ...curAtt } : undefined,
      timestamp: timeStr,
    };
    const scId = match(trimmed);
    const aiMsgId = `a-${Date.now() + 1}`;
    const target = buildResponse(scId ?? undefined, trimmed, s.tone, curAtt);
    const placeholder: ChatMessage = {
      id: aiMsgId,
      sender: "ai",
      rawText: "",
      scId: scId ?? undefined,
      isStreaming: true,
      timestamp: timeStr,
    };

    const nextMessages = [...baseMessages, userMsg, placeholder];

    let convId = s.activeConvId;
    let nextConvs: ConversationHistoryItem[];
    if (convId) {
      nextConvs = baseConvs.map((c) =>
        c.id === convId ? { ...c, messages: nextMessages } : c
      );
    } else {
      convId = `c-${Date.now()}`;
      const title = trimmed
        ? trimmed.length > 40
          ? trimmed.slice(0, 40) + "…"
          : trimmed
        : "New chat";
      nextConvs = [
        { id: convId, title, time: timeStr, fav: false, messages: nextMessages },
        ...baseConvs,
      ];
    }

    const pending: PendingStream = { aiMsgId, target, convId };

    set({
      input: "",
      attachments: { photo: false, file: false },
      followUpOpen: false,
      messages: nextMessages,
      conversations: nextConvs,
      activeConvId: convId,
      lastScId: scId ?? undefined,
      isStreaming: true,
      pending,
    });

    if (streamDelayTimer !== null) window.clearTimeout(streamDelayTimer);
    streamDelayTimer = window.setTimeout(() => {
      streamResponse({
        tokens: tokenize(target),
        intervalMs: TOKEN_INTERVAL_SEND,
        onToken: (buffer) =>
          set((st) => ({
            messages: st.messages.map((m) =>
              m.id === aiMsgId ? { ...m, rawText: buffer, isStreaming: true } : m
            ),
          })),
        onDone: () =>
          set((st) => ({
            isStreaming: false,
            pending: null,
            messages: st.messages.map((m) =>
              m.id === aiMsgId ? { ...m, rawText: target, isStreaming: false } : m
            ),
            conversations: st.conversations.map((c) =>
              c.id === convId
                ? { ...c, messages: finalizeMessage(c.messages, pending) }
                : c
            ),
          })),
      });
    }, STREAM_DELAY_MS);
  },

  regenerate: (aiMsgId) => {
    const s = get();
    get().showToast("Regenerating…");
    const msg = s.messages.find((m) => m.id === aiMsgId);
    if (!msg || msg.sender !== "ai") return;

    clearStreamTimers();
    const target = buildResponse(msg.scId, "", s.tone, s.attachments);
    const convId = s.activeConvId ?? "";
    const pending: PendingStream = { aiMsgId, target, convId };

    set({
      isStreaming: true,
      pending,
      messages: s.messages.map((m) =>
        m.id === aiMsgId ? { ...m, rawText: "", isStreaming: true } : m
      ),
    });

    streamResponse({
      tokens: tokenize(target),
      intervalMs: TOKEN_INTERVAL_REGEN,
      onToken: (buffer) =>
        set((st) => ({
          messages: st.messages.map((m) =>
            m.id === aiMsgId ? { ...m, rawText: buffer, isStreaming: true } : m
          ),
        })),
      onDone: () =>
        set((st) => ({
          isStreaming: false,
          pending: null,
          messages: st.messages.map((m) =>
            m.id === aiMsgId ? { ...m, rawText: target, isStreaming: false } : m
          ),
          conversations: convId
            ? st.conversations.map((c) =>
                c.id === convId
                  ? { ...c, messages: finalizeMessage(c.messages, pending) }
                  : c
              )
            : st.conversations,
        })),
    });
  },

  selectConversation: (conv) => {
    clearStreamTimers();
    const s = get();
    const fin = withPendingFinalized(s);
    const convs = fin.conversations ?? s.conversations;
    const target = convs.find((c) => c.id === conv.id);
    if (!target) return;
    const lastAi = target.messages.filter((m) => m.sender === "ai").slice(-1)[0];
    set({
      ...fin,
      activeConvId: target.id,
      messages: target.messages,
      lastScId: lastAi?.scId,
    });
    get().showToast(`Opened: ${target.title}`);
  },

  newChat: () => {
    clearStreamTimers();
    const fin = withPendingFinalized(get());
    set({
      ...fin,
      activeConvId: null,
      messages: [],
      lastScId: undefined,
      input: "",
      attachments: { photo: false, file: false },
    });
    get().showToast("New chat started");
  },

  toggleFav: (convId) =>
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === convId ? { ...c, fav: !c.fav } : c
      ),
    })),

  deleteConversation: (convId) => {
    clearStreamTimers();
    const s = get();
    const fin = withPendingFinalized(s);
    const wasActive = s.activeConvId === convId;
    set({
      ...fin,
      conversations: (fin.conversations ?? s.conversations).filter(
        (c) => c.id !== convId
      ),
      ...(wasActive ? { activeConvId: null, messages: [] } : {}),
    });
    get().showToast("Conversation deleted");
  },
    }),
    {
      name: "oh-matilda",
      partialize: (s) => ({
        conversations: s.conversations,
        activeConvId: s.activeConvId,
        theme: s.theme,
        perms: s.perms,
        tone: s.tone,
        webEnabled: s.webEnabled,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (state.activeConvId) {
          const conv = state.conversations.find((c) => c.id === state.activeConvId);
          if (conv) {
            state.messages = conv.messages;
            const lastAi = conv.messages.filter((m) => m.sender === "ai").slice(-1)[0];
            state.lastScId = lastAi?.scId;
          }
        }
      },
    }
  )
);
