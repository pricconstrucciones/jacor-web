import type { Metadata } from "next";
import Link from "next/link";
import { RequestNumber } from "./request-number";

export const metadata: Metadata = { title: "Pedido recibido", robots: { index: false } };

export default function Enviada() {
  return (
    <div className="wrap section">
      <RequestNumber />
      <Link className="btn btn-dark" href="/catalogo/">Volver al catálogo</Link>
    </div>
  );
}
