"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart";

export function CartLink() {
  const n = useCart().length;
  return (
    <Link className="cart-link" href="/solicitud/" aria-label={`Carrito: ${n} ${n === 1 ? "artículo" : "artículos"}`}>
      Carrito{n > 0 && <span className="badge">{n}</span>}
    </Link>
  );
}
