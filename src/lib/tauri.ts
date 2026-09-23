// Abstraction Tauri vs Web
// - Web API natives (fonctionnent dans la WebView Android de Tauri)
// - Les plugins natifs Tauri (clipboard/haptics) pourront être rajoutés si besoin

const isTauri = () => typeof window !== "undefined" && "__TAURI__" in window;

export const isTauriEnv = isTauri;

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {}
}

export async function vibrate(duration = 40) {
  try {
    navigator.vibrate?.(duration);
  } catch {}
}
