"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { clearCart, MAX_QTY, removeFromCart, updateQuantity, useCart } from "@/lib/cart";
import { INBOX_URL, money, priceFor, type Product } from "@/lib/types";
import { Turnstile, TURNSTILE_SITEKEY } from "./turnstile";

type Errors = Record<string, string>;
const FIELD_LABEL: Record<string, string> = { firstName: "Nombre", lastName: "Apellido", name: "Nombre", company: "Empresa", email: "Correo", phone: "Teléfono", message: "Observaciones", consent: "Privacidad" };
export type PriceIndex = Record<string, Pick<Product, "prices">>;

const newKey = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`);

/**
 * Carrito + datos de contacto. Los precios son los públicos finales (IVA incluido) del catálogo: la gestión los
 * vuelve a calcular al recibir el pedido (nunca confía en el navegador). Sin productos, se envía una consulta.
 */
export function RequestForm({ prices }: { prices: PriceIndex }) {
  const items = useCart();
  const router = useRouter();
  const [company, setCompany] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [general, setGeneral] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [human, setHuman] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const submitKey = useRef(newKey()); // mismo pedido = misma clave: un doble envío no crea dos pedidos
  const onHuman = useCallback((t: string | null) => setHuman(t), []);
  const isOrder = items.length > 0;

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("tipo") === "empresa") setCompany(true);
    fetch(`${INBOX_URL}/formulario`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setToken(d.token))
      .catch(() => setGeneral("No pudimos conectar con el sistema de pedidos. Intentá más tarde."));
  }, []);

  const unit = (slug: string, size: string | null) => (prices[slug] ? priceFor(prices[slug], size) : null);
  const total = items.reduce((a, it) => a + (unit(it.slug, it.size) ?? 0) * it.quantity, 0);
  const pendingPrice = items.filter((it) => unit(it.slug, it.size) === null).length;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    setErrors({}); setGeneral(null);
    const f = new FormData(e.currentTarget);
    const s = (k: string) => String(f.get(k) ?? "").trim();
    const body = {
      token, turnstile: human, website: s("website"), submitKey: submitKey.current,
      kind: company ? "EMPRESA" : "PARTICULAR", firstName: s("firstName"), lastName: s("lastName"), company: company ? s("company") : "",
      email: s("email"), phone: s("phone"), message: s("message"), consent: f.get("consent") === "on",
      items: items.map(({ slug, name, color, size, quantity, notes }) => ({ slug, name, color, size, quantity, notes })),
    };
    setSending(true);
    try {
      const r = await fetch(`${INBOX_URL}/solicitudes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.ok) {
        clearCart();
        submitKey.current = newKey();
        const ref = d.ref ?? d.number;
        router.push(`/solicitud/enviada/?t=${isOrder ? "pedido" : "consulta"}${ref ? `&n=${encodeURIComponent(ref)}` : ""}`);
        return;
      }
      setResetKey((k) => k + 1); // el token anti-robots sirve una sola vez
      if (d.errors) { setErrors(d.errors); setGeneral("Revisá los datos marcados."); }
      else setGeneral(d.error ?? "No pudimos enviar el pedido. Intentá de nuevo.");
    } catch {
      setGeneral("No pudimos conectar con el sistema de pedidos. Intentá más tarde.");
    } finally {
      setSending(false);
    }
  }

  const err = (k: string) => errors[k] && <span className="err" id={`err-${k}`}>{errors[k]}</span>;
  const a11y = (k: string) => (errors[k] ? { "aria-invalid": true, "aria-describedby": `err-${k}` } : {});
  const itemErr = (i: number) => Object.entries(errors).filter(([k]) => k === `items.${i}` || k.startsWith(`items.${i}.`)).map(([, v]) => v).join(" · ");
  const other = Object.entries(errors).filter(([k]) => !(k in FIELD_LABEL) && !k.startsWith("items.")).map(([, v]) => v);

  return (
    <form className="request" onSubmit={submit} noValidate>
      <section>
        <h3>Tu carrito</h3>
        {isOrder ? (
          <>
            <table className="cart">
              <thead><tr><th>Producto</th><th>Color</th><th>Talle</th><th>Cantidad</th><th className="num">Precio unit.</th><th className="num">Subtotal</th><th /></tr></thead>
              <tbody>
                {items.map((it, i) => {
                  const u = unit(it.slug, it.size);
                  return (
                    <tr key={`${it.slug}-${it.color}-${it.size}-${it.notes}`}>
                      <td><Link href={`/producto/${it.slug}/`}>{it.name}</Link>{it.code && <div className="muted">Cód. {it.code}</div>}{it.notes && <div className="muted">{it.notes}</div>}{itemErr(i) && <div className="err">{itemErr(i)}</div>}</td>
                      <td data-label="Color">{it.color ?? "—"}{it.colorPending && <div className="tag-pend">a confirmar</div>}</td>
                      <td data-label="Talle">{it.size ?? "—"}</td>
                      <td data-label="Cantidad"><input type="number" min={1} max={MAX_QTY} value={it.quantity} aria-label={`Cantidad de ${it.name}`} onChange={(e) => updateQuantity(i, Number(e.target.value))} /></td>
                      <td data-label="Precio unit." className="num">{u === null ? <span className="tag-pend">a confirmar</span> : money(u)}</td>
                      <td data-label="Subtotal" className="num">{u === null ? "—" : money(u * it.quantity)}</td>
                      <td><button type="button" className="link" onClick={() => removeFromCart(i)} aria-label={`Quitar ${it.name}`}>Quitar</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="cart-total">
              <span>Total estimado <small>(IVA incluido)</small></span>
              <b>{money(total)}</b>
            </div>
            {pendingPrice > 0 && <p className="muted">{pendingPrice === 1 ? "Un artículo tiene" : `${pendingPrice} artículos tienen`} precio a confirmar: no está{pendingPrice === 1 ? "" : "n"} incluido{pendingPrice === 1 ? "" : "s"} en el total. Te confirmamos el importe antes de cerrar el pedido.</p>}
            <p><Link href="/catalogo/">Seguir comprando</Link></p>
          </>
        ) : (
          <p className="muted">Tu carrito está vacío. Podés <Link href="/catalogo/">elegir productos del catálogo</Link> o enviarnos solo una consulta.</p>
        )}
        {err("items")}
      </section>

      <section>
        <h3>{isOrder ? "Datos para tu pedido" : "Tus datos"}</h3>
        <div className="fields">
          <label>Nombre *<input name="firstName" {...a11y("firstName")} autoComplete="given-name" maxLength={60} required />{err("firstName")}{err("name")}</label>
          <label>Apellido *<input name="lastName" {...a11y("lastName")} autoComplete="family-name" maxLength={60} required />{err("lastName")}</label>
          <label>Teléfono o WhatsApp<input name="phone" {...a11y("phone")} type="tel" autoComplete="tel" maxLength={40} />{err("phone")}</label>
          <label>Correo electrónico<input name="email" {...a11y("email")} type="email" autoComplete="email" maxLength={160} />{err("email")}</label>
          {company && <label>Empresa *<input name="company" {...a11y("company")} autoComplete="organization" maxLength={160} />{err("company")}</label>}
        </div>
        <p className="muted">Dejanos al menos un medio de contacto: teléfono o correo.</p>
        <label>{isOrder ? "Observaciones (opcional)" : "Consulta *"}<textarea name="message" rows={4} maxLength={2000} {...a11y("message")} />{err("message")}</label>
        {/* Campo trampa para robots: oculto para las personas */}
        <div className="hp" aria-hidden="true"><label>Sitio web<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <label className="check"><input type="checkbox" name="consent" {...a11y("consent")} /> Acepto la <Link href="/privacidad/" target="_blank">política de privacidad</Link> y que me contacten por este pedido. *</label>
        {err("consent")}
      </section>

      <Turnstile onToken={onHuman} resetKey={resetKey} />
      {isOrder
        ? <div className="notice"><b>Tu pedido está sujeto a confirmación de disponibilidad, precio final cuando corresponda y condiciones de entrega. No se realiza ningún cobro en esta instancia.</b></div>
        : <div className="notice">Te respondemos a la brevedad por el medio de contacto que indiques.</div>}
      {general && <p className="err" role="alert">{general}{other.length ? ` ${other.join(" · ")}` : ""}</p>}
      <button className="btn btn-dark btn-lg" disabled={sending || !token || (!!TURNSTILE_SITEKEY && !human)}>{sending ? "Enviando…" : isOrder ? "Enviar pedido" : "Enviar consulta"}</button>
    </form>
  );
}
