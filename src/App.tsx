import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AppHeader } from "@/components/AppHeader";
import { KebabMenu } from "@/components/KebabMenu";
import { Toast } from "@/components/Toast";
import { HomeState } from "@/components/HomeState";
import { Composer } from "@/components/Composer";
import { BottomSheet } from "@/components/BottomSheet";
import { MessageItem } from "@/components/MessageItem";
import { FollowUpPanel } from "@/components/FollowUpPanel";
import { VoiceOverlay } from "@/components/VoiceOverlay";
import { DeviceAccessModal } from "@/components/DeviceAccessModal";
import { ConversationList } from "@/components/ConversationList";
import { ArrowDown } from "@/lib/icons";
import { useChatStore } from "@/store/chatStore";

function App() {
  const theme = useChatStore((s) => s.theme);
  const toast = useChatStore((s) => s.toast);
  const messages = useChatStore((s) => s.messages);
  const conversations = useChatStore((s) => s.conversations);
  const activeConvId = useChatStore((s) => s.activeConvId);
  const input = useChatStore((s) => s.input);
  const attachments = useChatStore((s) => s.attachments);
  const tone = useChatStore((s) => s.tone);
  const webEnabled = useChatStore((s) => s.webEnabled);
  const kebabOpen = useChatStore((s) => s.kebabOpen);
  const sheetOpen = useChatStore((s) => s.sheetOpen);
  const followUpOpen = useChatStore((s) => s.followUpOpen);
  const followUpQuestions = useChatStore((s) => s.followUpQuestions);
  const voiceOpen = useChatStore((s) => s.voiceOpen);
  const accessOpen = useChatStore((s) => s.accessOpen);
  const perms = useChatStore((s) => s.perms);
  const listOpen = useChatStore((s) => s.listOpen);

  const showToast = useChatStore((s) => s.showToast);
  const setInput = useChatStore((s) => s.setInput);
  const attach = useChatStore((s) => s.attach);
  const removeAttachment = useChatStore((s) => s.removeAttachment);
  const toggleWeb = useChatStore((s) => s.toggleWeb);
  const setTone = useChatStore((s) => s.setTone);
  const toggleTheme = useChatStore((s) => s.toggleTheme);
  const toggleKebab = useChatStore((s) => s.toggleKebab);
  const closeKebab = useChatStore((s) => s.closeKebab);
  const openSheet = useChatStore((s) => s.openSheet);
  const closeSheet = useChatStore((s) => s.closeSheet);
  const openVoice = useChatStore((s) => s.openVoice);
  const closeVoice = useChatStore((s) => s.closeVoice);
  const openAccess = useChatStore((s) => s.openAccess);
  const closeAccess = useChatStore((s) => s.closeAccess);
  const continueAccess = useChatStore((s) => s.continueAccess);
  const openList = useChatStore((s) => s.openList);
  const closeList = useChatStore((s) => s.closeList);
  const openFollowUp = useChatStore((s) => s.openFollowUp);
  const closeFollowUp = useChatStore((s) => s.closeFollowUp);
  const enablePerm = useChatStore((s) => s.enablePerm);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const regenerate = useChatStore((s) => s.regenerate);
  const selectConversation = useChatStore((s) => s.selectConversation);
  const newChat = useChatStore((s) => s.newChat);
  const toggleFav = useChatStore((s) => s.toggleFav);
  const deleteConversation = useChatStore((s) => s.deleteConversation);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Hydratation persist : après reload, messages est vide mais activeConvId/conversations sont restaurés
  useEffect(() => {
    if (messages.length === 0 && activeConvId) {
      const conv = conversations.find((c) => c.id === activeConvId);
      if (conv && conv.messages.length > 0) {
        useChatStore.setState({ messages: conv.messages, lastScId: conv.messages.filter((m) => m.sender === "ai").slice(-1)[0]?.scId });
      }
    }
  }, [activeConvId, conversations, messages.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 80) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowScrollBottom(el.scrollHeight - el.scrollTop - el.clientHeight >= 80);
  };

  const activeConv = conversations.find((c) => c.id === activeConvId);

  return (
    <div className="flex flex-col h-dvh relative overflow-hidden">
      <AppHeader onOpenSidebar={openList} onToggleKebab={toggleKebab} />

      <div className="relative flex-1 min-h-0 overflow-hidden">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="absolute inset-0 overflow-y-auto overscroll-contain px-2.5 pb-1"
        >
          {messages.length === 0 ? (
            <HomeState onSelectPrompt={(p) => sendMessage(p)} />
          ) : (
            <div>
              <div
                className="text-center text-[10.5px] my-2 tracking-widest uppercase opacity-70"
                style={{ color: "var(--text-3)" }}
              >
                {activeConv ? `${activeConv.title} · ${activeConv.time}` : "New chat"}
              </div>
              {messages.map((m) => (
                <MessageItem
                  key={m.id}
                  message={m}
                  webEnabled={webEnabled}
                  tone={tone}
                  onToast={showToast}
                  onOpenFollowUp={openFollowUp}
                  onRegenerate={regenerate}
                />
              ))}
            </div>
          )}
        </div>

        <AnimatePresence>
          {showScrollBottom && (
            <motion.button
              key="fab-scroll"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              onClick={() => {
                const el = scrollRef.current;
                if (el) el.scrollTop = el.scrollHeight;
              }}
              className="absolute right-3.5 bottom-3.5 w-10 h-10 rounded-full border shadow-md flex items-center justify-center z-[15] active:scale-90"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--card-border)",
                color: "var(--text-2)",
              }}
              aria-label="Scroll to bottom"
            >
              <ArrowDown className="w-4 h-4" strokeWidth={2.2} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <Composer
        input={input}
        onChangeInput={setInput}
        attachments={attachments}
        onRemoveAttachment={removeAttachment}
        onOpenSheet={openSheet}
        onSend={() => sendMessage()}
        onStartVoice={openVoice}
      />

      <FollowUpPanel
        isOpen={followUpOpen}
        questions={followUpQuestions}
        onSelect={(q) => sendMessage(q)}
        onClose={closeFollowUp}
      />

      <BottomSheet
        isOpen={sheetOpen}
        onClose={closeSheet}
        onAttachPhoto={() => {
          attach("photo");
          closeSheet();
          showToast("Photo attached (simulated)");
        }}
        onAttachFile={() => {
          attach("file");
          closeSheet();
          showToast("File attached (simulated)");
        }}
        webEnabled={webEnabled}
        onToggleWeb={toggleWeb}
        tone={tone}
        onChangeTone={setTone}
      />

      <KebabMenu
        isOpen={kebabOpen}
        onClose={closeKebab}
        isDark={theme === "dark"}
        onToggleTheme={toggleTheme}
        onOpenSettings={() => showToast("Settings (simulated)")}
        onOpenAccess={openAccess}
        onOpenProfile={() => showToast("Profile (simulated)")}
      />

      <DeviceAccessModal
        isOpen={accessOpen}
        onClose={closeAccess}
        perms={perms}
        onEnablePerm={enablePerm}
        onContinue={continueAccess}
      />

      <VoiceOverlay
        isOpen={voiceOpen}
        onCancel={() => {
          closeVoice();
          showToast("Voice cancelled");
        }}
        onComplete={(transcript) => {
          closeVoice();
          sendMessage(transcript);
        }}
      />

      <ConversationList
        isOpen={listOpen}
        onClose={closeList}
        conversations={conversations}
        activeConvId={activeConvId}
        onSelectConversation={selectConversation}
        onToggleFav={toggleFav}
        onDeleteConversation={deleteConversation}
        onNewChat={newChat}
      />

      <Toast message={toast} />
    </div>
  );
}

export default App;
