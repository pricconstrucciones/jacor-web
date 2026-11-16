// Datos del sitio para buscadores. Se fijan al generar el sitio (variables NEXT_PUBLIC_*).
// Mientras no se decida publicar, el sitio pide NO ser indexado (robots y meta noindex).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:3100").replace(/\/$/, "");
export const INDEXABLE = process.env.NEXT_PUBLIC_INDEXAR === "si";
export const SITE_NAME = "JACOR";
export const abs = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
