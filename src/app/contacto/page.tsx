import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY, mailHref, telHref, whatsappHref } from "@/lib/legal";

export const metadata: Metadata = { title: "Contacto", description: `Contactá a ${COMPANY.name}: pedidos, consultas y atención a empresas.`, alternates: { canonical: "/contacto/" } };

export default function Contacto() {
  return (
    <div className="wrap section">
      <h1 className="page-title">Contacto</h1>
      <p className="lead-text">Escribinos para hacer un pedido, pedir asesoramiento o cotizar para tu empresa. Atendemos a todo el país.</p>
      <div className="contact-grid">
        <a className="contact-card" href={whatsappHref("Hola JACOR, quiero hacer una consulta.")} target="_blank" rel="noopener noreferrer">
          <span className="contact-kicker">WhatsApp</span>
          <b>{COMPANY.phone}</b>
          <span className="muted">Respuesta personalizada</span>
        </a>
        <a className="contact-card" href={mailHref}>
          <span className="contact-kicker">Correo electrónico</span>
          <b>{COMPANY.email}</b>
          <span className="muted">Pedidos, consultas y presupuestos</span>
        </a>
        <a className="contact-card" href={telHref}>
          <span className="contact-kicker">Teléfono</span>
          <b>{COMPANY.phone}</b>
          <span className="muted">{COMPANY.name} · {COMPANY.country}</span>
        </a>
      </div>
      <h2 className="contact-h2">Pedidos desde la web</h2>
      <p>Sumá los productos al carrito y envianos tu pedido: lo confirmamos con vos antes de cualquier cobro. Para una consulta sin productos, también podés escribirnos desde el formulario.</p>
      <p style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link className="btn btn-dark" href="/solicitud/">Ir al carrito o enviar una consulta</Link>
        <Link className="btn btn-outline" href="/solicitud/?tipo=empresa">Consulta de empresa</Link>
      </p>
    </div>
  );
}
