"use client";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { addToCart, MAX_QTY } from "@/lib/cart";
import { fromPrice, money, priceFor, type Product } from "@/lib/types";
import { useProductColor } from "./product-gallery";

type Msg = { ok: boolean; text: string } | null;

const ALFA = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "4XL", "5XL"];
/** Orden de talles: numéricos de menor a mayor; alfabéticos S, M, L, XL, XXL, XXXL. */
const sizeKey = (s: string) => (/^\d+$/.test(s) ? Number(s) : 1000 + (ALFA.indexOf(s.toUpperCase()) + 1 || 99));
const eq = (a: string, b: string) => a.localeCompare(b, "es", { sensitivity: "base" }) === 0;

/**
 * Compra: color, talle y cantidad, con el precio público final (IVA incluido) del talle elegido.
 * «Por talles» (empresas): una grilla talle × cantidad para un color; agrega un renglón por cada talle con cantidad.
 * Los colores a confirmar se pueden pedir solo como preferencia: JACOR los valida antes de confirmar el pedido.
 */
export function AddToRequest({ p }: { p: Pick<Product, "slug" | "code" | "name" | "colors" | "sizes" | "pendingSizes" | "colorsPending" | "prices"> }) {
  const id = useId();
  const canGrid = p.sizes.length > 1;
  const pendingColors = p.colorsPending ?? [];
  const allColors = [...p.colors, ...pendingColors];
  const isPendingColor = (c: string) => !!c && !p.colors.includes(c);
  const [mode, setMode] = useState<"unidad" | "talles">("unidad");
  const [color, setColor] = useState(allColors.length === 1 ? allColors[0] : "");
  // El color elegido en la galería se propone para el carrito (si es a confirmar, queda marcado como preferencia)
  const view = useProductColor();
  useEffect(() => {
    const c = view?.color && allColors.find((x) => eq(x, view.color!));
    if (c) setColor(c);
  }, [view?.color]); // eslint-disable-line react-hooks/exhaustive-deps
  const [size, setSize] = useState(p.sizes.length === 1 ? p.sizes[0] : "");
  const [qty, setQty] = useState("1");
  const [grid, setGrid] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");
  const [msg, setMsg] = useState<Msg>(null);

  const validQty = (v: string) => { const n = Number(v); return Number.isInteger(n) && n >= 1 && n <= MAX_QTY ? n : null; };
  const note = () => notes.trim().slice(0, 300) || null;
  const item = (s: string | null, quantity: number) => ({ slug: p.slug, code: p.code, name: p.name, color: color || null, colorPending: isPendingColor(color), size: s, quantity, notes: note() });

  function add() {
    if (allColors.length > 1 && !color) return setMsg({ ok: false, text: "Elegí un color." });
    if (mode === "talles") {
      const filled = Object.entries(grid).filter(([, v]) => v.trim() !== "");
      if (!filled.length) return setMsg({ ok: false, text: "Cargá la cantidad de al menos un talle." });
      const bad = filled.find(([, v]) => validQty(v) === null);
      if (bad) return setMsg({ ok: false, text: `Cantidad inválida en el talle ${bad[0]}.` });
      let total = 0;
      for (const [s, v] of filled) {
        const err = addToCart(item(s, validQty(v)!));
        if (err) return setMsg({ ok: false, text: err });
        total += validQty(v)!;
      }
      setGrid({}); setNotes("");
      return setMsg({ ok: true, text: `Agregado al carrito: ${total} unidades en ${filled.length} ${filled.length === 1 ? "talle" : "talles"}.` });
    }
    if (p.sizes.length > 1 && !size) return setMsg({ ok: false, text: "Elegí un talle." });
    if (size && !p.sizes.includes(size)) return setMsg({ ok: false, text: `El talle ${size} está sujeto a confirmación: todavía no se puede pedir.` });
    const n = validQty(qty);
    if (n === null) return setMsg({ ok: false, text: "Ingresá una cantidad válida." });
    const err = addToCart(item(size || null, n));
    setMsg(err ? { ok: false, text: err } : { ok: true, text: `Agregado al carrito: ${n} × ${p.name}${size ? ` (talle ${size})` : ""}.` });
    if (!err) { setQty("1"); setNotes(""); }
  }

  // Precio del talle elegido (o «desde» mientras no se elige); null = precio a confirmar
  const unit = size ? priceFor(p, size) : null;
  const from = fromPrice(p);
  const gridAmount = Object.entries(grid).reduce((a, [s, v]) => a + (validQty(v) ?? 0) * (priceFor(p, s) ?? 0), 0);
  const gridTotal = Object.values(grid).reduce((a, v) => a + (validQty(v) ?? 0), 0);
  const gridPending = Object.entries(grid).some(([s, v]) => validQty(v) !== null && priceFor(p, s) === null);

  return (
    <div className="addbox">
      <div className="pricebox" aria-live="polite">
        {!p.prices ? <span className="price-ask">Precio a consultar</span>
          : size && unit === null ? <><span className="price-ask">Precio a confirmar</span><span className="muted">El talle {size} todavía no tiene precio: podés pedirlo y te lo confirmamos.</span></>
          : <><span className="price">{size || !from.varies ? money(unit ?? from.min!) : `Desde ${money(from.min!)}`}</span><span className="muted">IVA incluido{!size && from.varies ? " · el precio depende del talle" : ""}</span></>}
      </div>
      {canGrid && (
        <div className="kind" role="radiogroup" aria-label="Forma de cargar">
          {([["unidad", "Por unidad"], ["talles", "Por talles (empresas)"]] as const).map(([k, l]) => (
            <label key={k} className={`chip${mode === k ? " on" : ""}`}><input type="radio" name={`${id}-modo`} checked={mode === k} onChange={() => { setMode(k); setMsg(null); }} /> {l}</label>
          ))}
        </div>
      )}
      <div className="row">
        {allColors.length > 1 && (
          <label>Color
            <select value={color} onChange={(e) => { setColor(e.target.value); if (e.target.value) view?.setColor(e.target.value); }}>
              <option value="">Elegí</option>
              {p.colors.map((c) => <option key={c}>{c}</option>)}
              {pendingColors.map((c) => <option key={c} value={c}>{c} · a confirmar</option>)}
            </select>
          </label>
        )}
        {mode === "unidad" && p.sizes.length > 1 && (
          <label>Talle
            <select value={size} onChange={(e) => setSize(e.target.value)}><option value="">Elegí</option>
              {/* Los talles sin confirmar se ven, pero no se pueden elegir */}
              {[...p.sizes, ...(p.pendingSizes ?? [])].sort((a, b) => sizeKey(a) - sizeKey(b)).map((s) => p.sizes.includes(s)
                ? <option key={s} value={s}>{s}{priceFor(p, s) === null && p.prices ? " · precio a confirmar" : ""}</option>
                : <option key={s} value={s} disabled>{s} · a confirmar</option>)}
            </select>
          </label>
        )}
        {mode === "unidad" && <label>Cantidad<input type="number" min={1} max={MAX_QTY} inputMode="numeric" value={qty} onChange={(e) => setQty(e.target.value)} /></label>}
      </div>
      {/* El aviso de color a confirmar lo muestra el selector de color de la ficha (sincronizado con este) */}
      {mode === "talles" && (
        <fieldset className="sizegrid">
          <legend>Cantidad por talle{color ? ` · ${color}` : ""}</legend>
          {p.sizes.map((s) => (
            <label key={s}>{s}<input type="number" min={0} max={MAX_QTY} inputMode="numeric" value={grid[s] ?? ""} placeholder="0" onChange={(e) => setGrid({ ...grid, [s]: e.target.value })} /></label>
          ))}
          <p className="muted" aria-live="polite">Total: {gridTotal} {gridTotal === 1 ? "unidad" : "unidades"}{gridAmount > 0 ? ` · ${money(gridAmount)} IVA incluido` : ""}{gridPending ? " (más los talles con precio a confirmar)" : ""}</p>
        </fieldset>
      )}
      <label>Nota (opcional)<input type="text" maxLength={300} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Por ejemplo: bordado de logo" /></label>
      <p style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", margin: 0 }}>
        <button type="button" className="btn btn-dark" onClick={add}>Agregar al carrito</button>
        {msg?.ok && <Link className="btn btn-outline" href="/solicitud/">Ver carrito</Link>}
      </p>
      {msg && <p className={msg.ok ? "ok" : "err"} role="status">{msg.text}</p>}
    </div>
  );
}
