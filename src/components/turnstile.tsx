"use client";
// Verificación anti-robots Cloudflare Turnstile (gratuita). Solo se carga si hay clave de sitio configurada
// (NEXT_PUBLIC_TURNSTILE_SITEKEY); sin clave, no se muestra ni se descarga nada de terceros.
import { useEffect, useRef } from "react";

export const TURNSTILE_SITEKEY = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY ?? "";
const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
declare global { interface Window { turnstile?: TurnstileApi } }

let loading: Promise<void> | null = null;
function loadScript() {
  loading ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SRC; s.async = true; s.defer = true;
    s.onload = () => resolve(); s.onerror = () => { loading = null; reject(new Error("turnstile")); };
    document.head.appendChild(s);
  });
  return loading;
}

/** `resetKey` cambia tras cada envío fallido: el token de Turnstile sirve una sola vez. */
export function Turnstile({ onToken, resetKey }: { onToken: (t: string | null) => void; resetKey: number }) {
  const el = useRef<HTMLDivElement>(null);
  const id = useRef<string | null>(null);

  useEffect(() => {
    if (!TURNSTILE_SITEKEY) return;
    let alive = true;
    loadScript().then(() => {
      if (!alive || !el.current || !window.turnstile) return;
      id.current = window.turnstile.render(el.current, {
        sitekey: TURNSTILE_SITEKEY, language: "es", callback: (t: string) => onToken(t),
        "expired-callback": () => onToken(null), "error-callback": () => onToken(null),
      });
    }).catch(() => onToken(null));
    return () => { alive = false; if (id.current) window.turnstile?.remove(id.current); id.current = null; };
  }, [onToken]);

  useEffect(() => {
    if (resetKey && id.current) { window.turnstile?.reset(id.current); onToken(null); }
  }, [resetKey, onToken]);

  return TURNSTILE_SITEKEY ? <div ref={el} className="turnstile" /> : null;
}
