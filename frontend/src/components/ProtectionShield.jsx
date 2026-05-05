import { useEffect } from "react";

// Frontend deterrents against PDF download / screenshot.
// IMPORTANT: This is dissuasive only — no web tech can fully prevent OS-level screenshots,
// screen recording (OBS/Streamlabs), or trusted browser extensions.
export function ProtectionShield({ active = true }) {
  useEffect(() => {
    if (!active) return;

    const blockedKey = (e) => {
      const k = e.key?.toLowerCase();
      const ctrlOrMeta = e.ctrlKey || e.metaKey;
      // Block: Ctrl+S, Ctrl+P, Ctrl+U, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, F12, PrintScreen
      if (
        (ctrlOrMeta && ["s", "p", "u"].includes(k)) ||
        (ctrlOrMeta && e.shiftKey && ["i", "j", "c"].includes(k)) ||
        e.key === "F12" ||
        e.key === "PrintScreen"
      ) {
        e.preventDefault();
        e.stopPropagation();
        try {
          // Best-effort clear any captured image from clipboard
          navigator.clipboard.writeText(" ").catch(() => {});
        } catch (_) {}
        return false;
      }
    };

    const blockContext = (e) => {
      e.preventDefault();
      return false;
    };

    const blockSelect = (e) => {
      e.preventDefault();
      return false;
    };

    const blockDrag = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener("contextmenu", blockContext);
    document.addEventListener("keydown", blockedKey, true);
    document.addEventListener("selectstart", blockSelect);
    document.addEventListener("dragstart", blockDrag);

    // Hide content when window loses focus (anti-screenshot deterrent)
    const onBlur = () => document.body.classList.add("pcs-blur-on-blur");
    const onFocus = () => document.body.classList.remove("pcs-blur-on-blur");
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    return () => {
      document.removeEventListener("contextmenu", blockContext);
      document.removeEventListener("keydown", blockedKey, true);
      document.removeEventListener("selectstart", blockSelect);
      document.removeEventListener("dragstart", blockDrag);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      document.body.classList.remove("pcs-blur-on-blur");
    };
  }, [active]);

  return null;
}
