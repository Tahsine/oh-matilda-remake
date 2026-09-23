// Scénarios — copie nettoyée de oh-matilda-—-ai-agent-chat/src/data/mockData.ts:145-628
// Dépend de ./images.ts pour IMG_* et de ../lib/svg implicite (déjà inline dans images.ts)
import type { Scenario, AutomationItem, ConversationHistoryItem } from "@/types";
import { IMG_SANTORINI, IMG_WA_BEFORE, IMG_WA_AFTER, IMG_SETTINGS_OFF, IMG_SETTINGS_ON } from "./images";

export const SCENARIOS: Record<string, Scenario> = {
  whatsapp_msg: {
    kw: ["text sam on whatsapp", "message sam on whatsapp", "send.*whatsapp", "whatsapp sam", "write on whatsapp"],
    thought: "Reading WhatsApp's accessibility tree — found the conversation with Sam and the compose field.",
    r: {
      formal: "I've drafted a message to **Sam**: “Running late, sorry!”. Please confirm before I send it.",
      friendly: "Drafted a message for **Sam**: “Running late, sorry!” — confirm and I'll send it! ✅",
      concise: "Message to Sam drafted. Confirm to send."
    },
    action: { app: "WhatsApp", desc: "Send message to Sam", before: IMG_WA_BEFORE, after: IMG_WA_AFTER },
    fu: ["Send another message", "Open WhatsApp again", "What can you do?"]
  },
  phone_action: {
    kw: ["turn on wi-?fi", "enable wi-?fi", "turn wi-?fi on", "wi-?fi in settings", "open settings", "connect to wi-?fi"],
    thought: "Reading the on-screen accessibility tree in Settings — found a toggle labeled “Wi-Fi”, currently off.",
    r: {
      formal: "I located the **Wi-Fi** toggle in Settings and I'm ready to turn it on. Please confirm before I act on your phone.",
      friendly: "Found the **Wi-Fi** switch in Settings — just confirm and I'll flip it on for you! ✅",
      concise: "Wi-Fi toggle found in Settings. Confirm to proceed."
    },
    action: { app: "Settings", desc: "Tap the Wi-Fi toggle", before: IMG_SETTINGS_OFF, after: IMG_SETTINGS_ON },
    fu: ["Turn Wi-Fi back off", "Open Settings again", "What can you do?"]
  },
  santorini: {
    kw: ["what'?s this place", "where is this", "santorini", "this photo", "which place is"],
    thought: "Matching visual landmarks: caldera, white cubes, blue domes…",
    viewed: "Travel Guides 2025",
    r: {
      formal: "That is **Santorini, Greece** — the town of Oia, perched above the caldera. It is known for whitewashed houses, blue domes, and what many consider the finest sunset in the Aegean.",
      friendly: "That's **Santorini, Greece**! 🇬🇷 Specifically Oia — the cliffside town famous for whitewashed lanes, blue domes and legendary sunsets.",
      concise: "**Santorini, Greece** (Oia village), overlooking the caldera."
    },
    fu: ["When is the best time to go?", "Plan a 5-day itinerary", "Find quieter alternatives"]
  },
  travel: {
    kw: ["trip", "travel", "vacation", "holiday", "relax", "beach", "destination", "getaway"],
    thought: "Comparing calm, scenic destinations matched to “beautiful and relaxing”…",
    viewed: "Travel Guides 2025",
    img: IMG_SANTORINI,
    r: {
      formal: "If beauty and relaxation are the priorities, I would recommend the **Greek Islands**, the **Amalfi Coast** in Italy, or **Bali** in Indonesia. Each pairs striking scenery with a slower pace of life. May I ask whether you prefer beaches, culture, or cuisine? I will tailor a shortlist accordingly.",
      friendly: "Ooh, nice! If you're after beauty + pure relaxation, think **Greek Islands**, **Amalfi Coast** in Italy, or **Bali** in Indonesia 🌊 Do you lean more beaches, culture, or food? I'll shape the shortlist around that!",
      concise: "Top picks: **Greek Islands**, **Amalfi Coast** (Italy), **Bali** (Indonesia). Tell me your preference: beaches, culture, or food."
    },
    fu: ["What's this place?", "When is the best time to go?", "Plan a 5-day itinerary"]
  },
  design: {
    kw: ["design system", "design systems", "component library"],
    thought: "Defining design systems, then structuring components, standards and purpose…",
    viewed: "Design Handbook",
    r: {
      formal: "Design systems are essential frameworks that streamline and standardise the process of creating digital products. At their core, ==design systems consist of reusable components== [[cite:1]] and clear standards for how to use them, ensuring a consistent user experience across a product family [[cite:2]].",
      friendly: "Think of a design system as the shared toolbox + rulebook for building a product: ==reusable components== plus clear standards, so every screen feels like family 🧩",
      concise: "A design system = **reusable components** + **standards** that keep product UX consistent."
    },
    fu: ["What are the essential components included in most design systems?", "How do you ensure consistency in components across different platforms?", "How do you handle version control and updates for components?"]
  },
  support_slow: {
    kw: ["slow", "laptop", "computer", "freez", "performance", "slug"],
    thought: "Narrowing likely causes: recent changes, storage pressure, startup load…",
    viewed: "System Diagnostics",
    r: {
      formal: "Let us troubleshoot methodically. First question: have you **installed or updated any software recently**? Recent changes are the most common cause of a sudden slowdown.",
      friendly: "Let's troubleshoot like tech ninjas 🥷 First question: did you **install or update anything recently**?",
      concise: "Likely causes: recent installs/updates, low disk space, startup load. Did you install or update anything recently?"
    },
    fu: ["I installed Chrome extensions and updated Zoom", "How do I clear browser cache?", "Which files are safe to delete?"]
  },
  capabilities: {
    kw: ["what can you do", "capabilities", "who are you", "your name", "help me with"],
    thought: "Summarising agent scope and strengths…",
    r: {
      formal: "I am **Oh-Matilda**, your AI agent. I can research and summarise topics, draft and rewrite text, brainstorm ideas, plan trips and schedules, and troubleshoot common technical problems. Tell me the outcome you want and I will take it from there.",
      friendly: "Hey, I'm **Oh-Matilda**! Lots: research & summaries, writing & rewrites, brainstorming, trip planning, even tech first-aid 🩺 Point me at a goal and I'll go.",
      concise: "I'm **Oh-Matilda**. I research, write, brainstorm, plan trips, and troubleshoot tech issues."
    },
    fu: ["Plan a relaxing trip somewhere beautiful", "Explain what a design system is", "My laptop is slow since yesterday"]
  },
  greeting: {
    kw: ["^hi$", "^hello$", "^hey+$", "good morning", "good evening", "good afternoon", "bonjour", "salut"],
    thought: "A warm, brief acknowledgement…",
    r: {
      formal: "Good evening. I am **Oh-Matilda**, your AI agent. How may I assist you today?",
      friendly: "Hey hey 👋 I'm **Oh-Matilda**. What are we getting into today?",
      concise: "Hello. How can I help?"
    },
    fu: ["What can you do?", "Plan a relaxing trip somewhere beautiful", "Explain what a design system is"]
  },
  thanks: {
    kw: ["thank", "thx", "appreciate", "merci"],
    thought: "Closing the loop graciously…",
    r: {
      formal: "You are most welcome. Should you need anything further, I remain at your disposal.",
      friendly: "Anytime! 💚 Come back whenever you need me.",
      concise: "You're welcome."
    },
    fu: ["What can you do?", "Plan a relaxing trip somewhere beautiful", "Explain what a design system is"]
  }
};

export const SCENARIO_ORDER = ["whatsapp_msg","phone_action","santorini","travel","design","support_slow","capabilities","greeting","thanks"];

export const GENERIC_SCENARIO: Scenario = {
  kw: [],
  thought: "No exact match found — composing a structured answer…",
  r: {
    formal: "Thank you for the context. Regarding “**{U}**” — I would approach it in three steps: clarify the objective, gather the relevant facts, and propose a concrete course of action. Confirm the direction and I will prepare the detailed next steps.",
    friendly: "Great question! On “**{U}**” — here's my spin: start from the goal, list what we already know, then pick the smallest step that moves the needle. Want me to go deeper on any part? ✨",
    concise: "On “**{U}**”: clarify the goal → gather facts → propose the next step. Say the word and I'll expand."
  },
  fu: ["Rewrite this more formally", "Give me a concrete example", "Thank you!"]
};

export const SOURCES_BY_TOPIC: Record<string, string[]> = {
  travel: ["cyclades-guide.gr", "amalfi-coast.it", "bali-tourism.id"],
  design: ["designhandbook.dev", "components.studio", "semver.org"],
  support: ["support.google.com", "apple.com", "bleepingcomputer.com"],
  generic: ["wikipedia.org", "reddit.com", "medium.com"]
};

export function getSourcesFor(scId?: string): string[] {
  if (!scId) return SOURCES_BY_TOPIC.generic;
  if (/travel|santorini/.test(scId)) return SOURCES_BY_TOPIC.travel;
  if (/design/.test(scId)) return SOURCES_BY_TOPIC.design;
  if (/support/.test(scId)) return SOURCES_BY_TOPIC.support;
  return SOURCES_BY_TOPIC.generic;
}

export const DEFAULT_AUTOMATIONS: AutomationItem[] = [
  { id: 'a1', name: "Morning briefing", sched: "Daily · 09:00", on: true },
  { id: 'a2', name: "Weekly recap draft", sched: "Fridays · 17:00", on: false }
];

export const INITIAL_CONVERSATIONS: ConversationHistoryItem[] = [
  {
    id: "c1", fav: true, time: "09:49", title: "Santorini trip planning",
    messages: [
      { id: "m-c1-1", sender: 'user', text: "Plan a relaxing trip somewhere beautiful", timestamp: "09:48" },
      { id: "m-c1-2", sender: 'ai', scId: "travel", rawText: SCENARIOS.travel.r.formal, timestamp: "09:48" },
      { id: "m-c1-3", sender: 'user', text: "What's this place?", timestamp: "09:49" },
      { id: "m-c1-4", sender: 'ai', scId: "santorini", rawText: SCENARIOS.santorini.r.formal, timestamp: "09:49" }
    ]
  },
  {
    id: "c2", fav: true, time: "Tue", title: "Design system Q&A",
    messages: [
      { id: "m-c2-1", sender: 'user', text: "What are design systems?", timestamp: "Tue" },
      { id: "m-c2-2", sender: 'ai', scId: "design", rawText: SCENARIOS.design.r.formal, timestamp: "Tue" }
    ]
  }
];

export function matchScenario(text: string): string | null {
  const t = text.toLowerCase().trim();
  for (const key of SCENARIO_ORDER) {
    const kw = SCENARIOS[key].kw;
    for (const pattern of kw) {
      try { if (new RegExp(pattern, "i").test(t)) return key; } catch {}
    }
  }
  return null;
}
