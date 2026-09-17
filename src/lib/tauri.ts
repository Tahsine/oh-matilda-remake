// Abstraction Tauri vs Web
// - Dans `npm run tauri dev` / mobile : utilise les plugins Rust
// - Dans `npm run dev` (vite seul) : fallback Web API

const isTauri = () => typeof window !== "undefined" && "__TAURI__" in window;

export const isTauriEnv = isTauri;

export async function copyText(text: string) {
  if (isTauri()) {
    const { writeText } = await import("@tauri-apps/plugin-clipboard-manager");
    return writeText(text);
  }
  return navigator.clipboard.writeText(text);
}

export async function vibrate(duration = 40) {
  if (isTauri()) {
    try {
      const { vibrate: h } = await import("@tauri-apps/plugin-haptics");
      return h({ duration });
    } catch {}
  }
  try {
    navigator.vibrate?.(duration);
  } catch {}
}
