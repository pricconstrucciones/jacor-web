"use client";
// Galería por color de la ficha. El color elegido controla las fotos; ver un color NO lo habilita para la solicitud:
// solo los colores confirmados (p.colors) se pueden pedir. Los demás se muestran como «Color sujeto a confirmación».
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { imageUrl, type Product } from "@/lib/types";

type Img = Product["images"][number];
export type ViewColor = { name: string; quotable: boolean; hasPhoto: boolean };
type Ctx = { color: string | null; setColor: (c: string | null) => void; colors: ViewColor[]; images: Img[] };

const eq = (a?: string | null, b?: string | null) => !!a && !!b && a.localeCompare(b, "es", { sensitivity: "base" }) === 0;
const ColorCtx = createContext<Ctx | null>(null);
export const useProductColor = () => useContext(ColorCtx);

/** Colores para ver: los de las fotos (en su orden) y, después, los confirmados que todavía no tienen foto. */
export function viewColors(p: Pick<Product, "images" | "colors" | "colorsPending">): ViewColor[] {
  const out: ViewColor[] = [];
  for (const i of p.images) if (i.color && !out.some((c) => eq(c.name, i.color))) out.push({ name: i.color, quotable: p.colors.some((c) => eq(c, i.color)), hasPhoto: true });
  // Con fotos sin color (p. ej. calzado), las fotos valen para todos sus colores
  const neutral = p.images.some((i) => !i.color);
  for (const c of p.colors) if (!out.some((o) => eq(o.name, c))) out.push({ name: c, quotable: true, hasPhoto: neutral });
  for (const c of p.colorsPending ?? []) if (!out.some((o) => eq(o.name, c))) out.push({ name: c, quotable: false, hasPhoto: neutral });
  return out;
}

export function ColorProvider({ p, children }: { p: Pick<Product, "images" | "colors" | "colorsPending">; children: ReactNode }) {
  const colors = useMemo(() => viewColors(p), [p]);
  const [color, setColor] = useState<string | null>(colors[0]?.name ?? null);
  // Enlace directo a un color: /producto/camisa-ombu/?color=Beige
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("color");
    const c = q && colors.find((x) => eq(x.name, q));
    if (c) setColor(c.name);
  }, [colors]);
  return <ColorCtx.Provider value={{ color, setColor, colors, images: p.images }}>{children}</ColorCtx.Provider>;
}

/** Vista de la foto: el último tramo del texto alternativo (p. ej. «en oficina»). */
const view = (alt: string) => { const v = alt.split(" · ").slice(1).pop() ?? ""; return v.charAt(0).toUpperCase() + v.slice(1); };

export function ProductGallery({ name }: { name: string }) {
  const ctx = useProductColor();
  const color = ctx?.color ?? null;
  const all = ctx?.images ?? [];
  const own = all.filter((i) => !i.color || !color || eq(i.color, color));
  // Sin foto del color elegido: se muestra otra como referencia, aclarándolo (nunca como si fuera ese color)
  const fallback = own.length === 0 && all.length > 0;
  const list = fallback ? [all[0]] : own;
  const [idx, setIdx] = useState(0);
  useEffect(() => setIdx(0), [color]); // al cambiar de color se vuelve a la primera foto de ese color
  const i = Math.min(idx, Math.max(list.length - 1, 0));
  const cur = list[i];
  const n = list.length;
  const go = (d: number) => setIdx((i + d + n) % n);
  const touch = useRef<number | null>(null);

  if (!cur) return <div className="ph ph-round"><span>Foto en preparación</span></div>;
  return (
    <div className="gal">
      <figure>
        <div className="gal-main ph ph-filled ph-round"
          onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => { if (touch.current === null || n < 2) return; const dx = e.changedTouches[0].clientX - touch.current; touch.current = null; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); }}>
          <img src={imageUrl(cur.file)} alt={cur.alt} />
          {fallback && <span className="gal-ref">Foto de referencia en {all[0].color?.toLowerCase() ?? "otro color"}: todavía no tenemos foto en {color?.toLowerCase()}</span>}
          {n > 1 && <>
            <button type="button" className="gal-nav gal-prev" onClick={() => go(-1)} aria-label="Foto anterior">‹</button>
            <button type="button" className="gal-nav gal-next" onClick={() => go(1)} aria-label="Foto siguiente">›</button>
            <span className="gal-count" aria-live="polite">{i + 1} / {n}</span>
          </>}
        </div>
        <figcaption>{[!fallback && cur.color, view(cur.alt)].filter(Boolean).join(" · ") || name}</figcaption>
      </figure>
      {n > 1 && (
        <div className="gal-thumbs" role="list" aria-label={`Fotos${color ? ` en ${color.toLowerCase()}` : ""}`}>
          {list.map((t, k) => (
            <button key={t.file} type="button" role="listitem" className={`gal-thumb${k === i ? " on" : ""}`} aria-current={k === i} aria-label={view(t.alt) || `Foto ${k + 1}`} onClick={() => setIdx(k)}>
              <img src={imageUrl(t.file)} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Selector de color para ver las fotos. Los colores pendientes se pueden mirar, pero no pedir. */
export function ColorPicker() {
  const ctx = useProductColor();
  if (!ctx || ctx.colors.length === 0) return null;
  const sel = ctx.colors.find((c) => eq(c.name, ctx.color));
  return (
    <div className="colorpick">
      <h4 className="muted">Color{sel ? <>: <b>{sel.name}</b></> : null}</h4>
      <div role="radiogroup" aria-label="Color">
        {ctx.colors.map((c) => (
          <button key={c.name} type="button" role="radio" aria-checked={eq(c.name, ctx.color)} className={`chip${eq(c.name, ctx.color) ? " on" : ""}${c.quotable ? "" : " chip-pend"}`}
            onClick={() => ctx.setColor(c.name)} title={c.quotable ? undefined : "Color sujeto a confirmación"}>
            {c.name}{!c.quotable && <span aria-hidden="true"> *</span>}
          </button>
        ))}
      </div>
      {sel && !sel.quotable && <p className="pend-note"><b>Color sujeto a confirmación.</b> Podés pedirlo como preferencia: lo validamos con fábrica antes de confirmar tu pedido.</p>}
      {sel && !sel.hasPhoto && <p className="muted">Todavía no tenemos foto de este color.</p>}
      {ctx.colors.some((c) => !c.quotable) && !(sel && !sel.quotable) && <p className="muted">* Color sujeto a confirmación.</p>}
    </div>
  );
}
