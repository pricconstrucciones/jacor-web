"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { CartLink } from "./cart-link";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo/", label: "Catálogo" },
  { href: "/empresas/", label: "Empresas" },
  { href: "/nosotros/", label: "Nosotros" },
  { href: "/contacto/", label: "Contacto" },
];

export function Header() {
  const path = usePathname() ?? "/";
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => { if (menu.current) menu.current.open = false; }, [path]); // el menú móvil se cierra al navegar
  const current = (href: string) => ((href === "/" ? path === "/" : path.startsWith(href.replace(/\/$/, ""))) ? "page" : undefined);
  const links = LINKS.map((l) => <Link key={l.href} href={l.href} aria-current={current(l.href)}>{l.label}</Link>);
  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" aria-label="JACOR, inicio"><img src="/brand/jacor-principal-compacto-negativo.svg" alt="JACOR" /></Link>
        <nav className="nav" aria-label="Principal">{links}</nav>
        <CartLink />
        <details className="menu" ref={menu}><summary aria-label="Abrir menú">Menú ☰</summary><nav aria-label="Principal (móvil)">{links}</nav></details>
      </div>
    </header>
  );
}
