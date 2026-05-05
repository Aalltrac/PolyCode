import { useEffect } from "react";

// Loads the Ko-fi floating chat overlay widget once.
export function KofiWidget() {
  useEffect(() => {
    if (window.__KOFI_LOADED__) return;
    window.__KOFI_LOADED__ = true;

    const script = document.createElement("script");
    script.src = "https://storage.ko-fi.com/cdn/scripts/overlay-widget.js";
    script.async = true;
    script.onload = () => {
      try {
        if (window.kofiWidgetOverlay) {
          window.kofiWidgetOverlay.draw("polycodeschool", {
            type: "floating-chat",
            "floating-chat.donateButton.text": "Support",
            "floating-chat.donateButton.background-color": "#6A66EB",
            "floating-chat.donateButton.text-color": "#fff",
          });
        }
      } catch (e) {
        // Silently ignore Ko-fi widget render errors
      }
    };
    document.body.appendChild(script);
  }, []);

  return null;
}
