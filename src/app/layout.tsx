import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { getCatalog } from "@/lib/catalog";
import { INDEXABLE, SITE_NAME, SITE_URL } from "@/lib/site";
import { COMPANY, mailHref, whatsappHref } from "@/lib/legal";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: "Indumentaria laboral para empresas e industrias: camisas, pantalones, bombachas, bermudas, remeras, chombas y ambos.",
  icons: { icon: "/brand/jacor-isotipo-color.svg" },
  openGraph: { siteName: SITE_NAME, locale: "es_AR", type: "website" },
  robots: INDEXABLE ? undefined : { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { ejemplo } = getCatalog();
  return (
    <html lang="es-AR">
      <body>
        <a className="skip" href="#contenido">Saltar al contenido</a>
        <Header />
        {ejemplo && <div className="wrap"><div className="notice">Vista de desarrollo con productos de EJEMPLO: todavía no se publicó el catálogo desde la gestión.</div></div>}
        <main id="contenido" tabIndex={-1}>{children}</main>
        <footer className="site-footer">
          <div className="wrap">
            <img src="/brand/jacor-reducida-negativo.svg" alt="JACOR" />
            <span>{COMPANY.name} · <a href={mailHref}>{COMPANY.email}</a> · <a href={whatsappHref()} target="_blank" rel="noopener noreferrer">WhatsApp {COMPANY.phone}</a> · {COMPANY.country}</span>
            <Link href="/privacidad/">Política de privacidad</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
