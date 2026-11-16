import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Soluciones para empresas",
  description: "Cotizaciones por volumen de indumentaria laboral: varios talles por pedido y compras recurrentes.",
  alternates: { canonical: "/empresas/" },
};

const ITEMS = [
  ["Compras por volumen", "Cotización según cantidades para equipar a todo el personal."],
  ["Varios talles por pedido", "Un mismo producto en todos los talles que necesites, en una sola solicitud."],
  ["Compras recurrentes", "Reposición periódica de la ropa de trabajo de tu personal."],
  ["Atención personalizada", "Un contacto comercial que acompaña cada pedido."],
];

const STEPS = [
  ["Elegí los productos", "Recorré el catálogo por categoría o con el buscador."],
  ["Cargá las cantidades por talle", "En la ficha, «Por talles (empresas)» te deja indicar cuántas unidades de cada talle y color necesitás, con una nota (por ejemplo, bordado de logo)."],
  ["Enviá la solicitud", "Indicá los datos de la empresa y si es una compra recurrente, con su frecuencia estimada."],
  ["Recibí el presupuesto", "Te respondemos con una cotización. Enviar la solicitud no genera una compra ni un compromiso."],
];

export default function Empresas() {
  return (
    <div className="wrap section">
      <h1 className="page-title">Soluciones para empresas</h1>
      <div className="grid2" style={{ margin: "24px 0" }}>
        {ITEMS.map(([t, d]) => <div key={t} className="tile" style={{ padding: 20 }}><h2 className="tile-title">{t}</h2><p className="muted" style={{ margin: "6px 0 0" }}>{d}</p></div>)}
      </div>
      <h2>Cómo pedir una cotización</h2>
      <ol className="steps">
        {STEPS.map(([t, d]) => <li key={t}><b>{t}</b><span className="muted">{d}</span></li>)}
      </ol>
      <p style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link className="btn btn-dark" href="/catalogo/">Ver catálogo</Link>
        <Link className="btn btn-outline" href="/solicitud/?tipo=empresa">Consultar como empresa</Link>
      </p>
    </div>
  );
}
