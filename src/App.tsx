import { useEffect, useRef, useState } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { KebabMenu } from '@/components/KebabMenu';
import { Toast } from '@/components/Toast';
import { HomeState } from '@/components/HomeState';
import { Composer } from '@/components/Composer';
import { BottomSheet } from '@/components/BottomSheet';
import { MessageItem } from '@/components/MessageItem';
import { FollowUpPanel } from '@/components/FollowUpPanel';
import { VoiceOverlay } from '@/components/VoiceOverlay';
import { DeviceAccessModal } from '@/components/DeviceAccessModal';
import { ConversationList } from '@/components/ConversationList';
import { matchScenario, SCENARIOS, INITIAL_CONVERSATIONS } from '@/constants/scenarios';
import type { AttachmentState, ChatMessage, ConversationHistoryItem, DevicePerms, ToneType } from '@/types';

type Theme = 'light' | 'dark';

const now = () =>
  new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

function App() {
  const [kebabOpen, setKebabOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [toast, setToast] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<AttachmentState>({ photo: false, file: false });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [webEnabled, setWebEnabled] = useState(false);
  const [tone, setTone] = useState<ToneType>('formal');
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const [perms, setPerms] = useState<DevicePerms>({ a11y: false, capture: false });
  const [conversations, setConversations] = useState<ConversationHistoryItem[]>(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const showToast = (message: string) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  };

  // Phase 3 remplacera ce stub par la logique agent (src/lib/mockAgent.ts)
  const handleSend = (text: string, att?: AttachmentState) => {
    const trimmed = text.trim();
    const scId = matchScenario(trimmed);
    const sc = scId ? SCENARIOS[scId] : undefined;
    const aiText = sc ? sc.r[tone] : 'One moment — I am on it. (agent logic arrives in phase 3)';
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      attachments: att && (att.photo || att.file) ? att : undefined,
      timestamp: now(),
    };
    const aiMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      sender: 'ai',
      rawText: aiText,
      scId: scId ?? undefined,
      timestamp: now(),
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    if (activeConvId) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId ? { ...c, messages: [...c.messages, userMsg, aiMsg] } : c
        )
      );
    }
    setInput('');
    setAttachments({ photo: false, file: false });
  };

  const selectConversation = (conv: ConversationHistoryItem) => {
    setActiveConvId(conv.id);
    setMessages(conv.messages);
  };

  const newChat = () => {
    setActiveConvId(null);
    setMessages([]);
  };

  const toggleFav = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, fav: !c.fav } : c))
    );
  };

  const deleteConversation = (convId: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== convId));
    if (activeConvId === convId) {
      setActiveConvId(null);
      setMessages([]);
    }
    showToast('Conversation deleted');
  };

  const openFollowUp = (scId?: string) => {
    const sc = scId ? SCENARIOS[scId] : undefined;
    if (sc?.fu?.length) {
      setFollowUpQuestions(sc.fu);
      setFollowUpOpen(true);
    } else {
      showToast('Coming soon');
    }
  };

  return (
    <div className="flex flex-col h-dvh relative overflow-hidden">
      <AppHeader
        onOpenSidebar={() => setListOpen(true)}
        onToggleKebab={() => setKebabOpen((v) => !v)}
      />

      <main className="flex-1 overflow-y-auto overscroll-contain">
        {messages.length === 0 ? (
          <HomeState onSelectPrompt={(p) => handleSend(p)} />
        ) : (
          <div className="px-2.5 pb-1">
            {messages.map((m) => (
              <MessageItem
                key={m.id}
                message={m}
                webEnabled={webEnabled}
                tone={tone}
                onToast={showToast}
                onOpenFollowUp={openFollowUp}
                onRegenerate={() => showToast('Coming soon')}
              />
            ))}
          </div>
        )}
      </main>

      <Composer
        input={input}
        onChangeInput={setInput}
        attachments={attachments}
        onRemoveAttachment={(type) =>
          setAttachments((prev) => ({ ...prev, [type]: false }))
        }
        onOpenSheet={() => setSheetOpen(true)}
        onSend={() => handleSend(input, attachments)}
        onStartVoice={() => setVoiceOpen(true)}
      />

      <FollowUpPanel
        isOpen={followUpOpen}
        questions={followUpQuestions}
        onSelect={(q) => {
          setFollowUpOpen(false);
          handleSend(q);
        }}
        onClose={() => setFollowUpOpen(false)}
      />

      <BottomSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onAttachPhoto={() => {
          setAttachments((prev) => ({ ...prev, photo: true }));
          setSheetOpen(false);
        }}
        onAttachFile={() => {
          setAttachments((prev) => ({ ...prev, file: true }));
          setSheetOpen(false);
        }}
        webEnabled={webEnabled}
        onToggleWeb={() => setWebEnabled((v) => !v)}
        tone={tone}
        onChangeTone={setTone}
      />

      <KebabMenu
        isOpen={kebabOpen}
        onClose={() => setKebabOpen(false)}
        isDark={theme === 'dark'}
        onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        onOpenSettings={() => showToast('Coming soon')}
        onOpenAccess={() => setAccessOpen(true)}
        onOpenProfile={() => showToast('Coming soon')}
      />

      <DeviceAccessModal
        isOpen={accessOpen}
        onClose={() => setAccessOpen(false)}
        perms={perms}
        onEnablePerm={(perm) => {
          setPerms((prev) => ({ ...prev, [perm]: true }));
          showToast('Permission granted (simulated)');
        }}
        onContinue={() => {
          setAccessOpen(false);
          showToast('Access ready');
        }}
      />

      <VoiceOverlay
        isOpen={voiceOpen}
        onCancel={() => setVoiceOpen(false)}
        onComplete={(transcript) => {
          setVoiceOpen(false);
          handleSend(transcript);
        }}
      />

      <ConversationList
        isOpen={listOpen}
        onClose={() => setListOpen(false)}
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
