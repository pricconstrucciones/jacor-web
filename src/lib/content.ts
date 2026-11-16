// Contenido comercial de la web en un solo lugar: enfoque, textos del inicio e imágenes.
import type { LineKey } from "./types";

/** Líneas que muestra la web (para ocultar una, quitarla de esta lista; sigue en el catálogo de la gestión). */
// EPP queda fuera hasta que tenga productos con ficha y fotos (los 9 están sin publicar).
export const ACTIVE_LINES: LineKey[] = ["indumentaria-laboral", "calzado-de-seguridad"];

/**
 * Orden de los productos dentro de cada categoría (primero lo que no figura acá queda al final, por nombre).
 * Las líneas y categorías ya vienen ordenadas: primero indumentaria, después calzado.
 */
export const PRODUCT_ORDER = [
  "camisa-ombu", "pantalon-ombu-de-trabajo", "pantalon-ombu-cargo", "bombacha-gaucho-ombu", "bermuda-ombu-cargo",
  "remera-clasica-manga-corta", "chomba-pique-manga-corta", "chomba-de-jersey", "ambo",
];

/** Opciones de subtítulo para el inicio (a elegir). Solo describen lo que la web ya ofrece. */
export const SUBTITLE_OPTIONS = [
  "Ropa de trabajo para empresas e industrias, con todos los talles que necesita tu equipo.",
  "Equipamos a tu personal con indumentaria de trabajo: compras por volumen y reposición periódica.",
  "Camisas, pantalones y ropa de trabajo para tu empresa, con atención comercial personalizada.",
] as const;

export const HERO = {
  title: "Indumentaria laboral",
  subtitle: SUBTITLE_OPTIONS[0],
  /** Imagen principal (opcional): poner el archivo en web/public/img/ y su ruta acá, p. ej. "/img/hero.jpg". */
  image: "/img/hero-panoramica.webp" as string | null,
  imageAlt: "Equipo de trabajo con camisas y pantalones de trabajo en una planta industrial",
};

/**
 * Imágenes de las categorías del inicio (opcionales). Archivo en web/public/img/categorias/ y su ruta acá.
 * Sin imagen, se muestra un espacio reservado con la medida sugerida.
 */
export const CATEGORY_IMAGES: Record<string, string | null> = {
  Camisas: "/img/categorias/camisas.webp",
  Pantalones: "/img/categorias/pantalones.webp",
  "Bombachas de campo": "/img/categorias/bombachas.webp",
  Bermudas: "/img/categorias/bermudas.webp",
  "Remeras y chombas": "/img/categorias/remeras-chombas.webp",
  Ambos: "/img/categorias/ambos.webp",
  "Calzado de seguridad": "/img/categorias/calzado.webp",
};

/** Medidas sugeridas para preparar las fotos (proporción en la que se recortan). */
export const IMAGE_SIZES = { hero: "1600 × 1000 px (16:10)", category: "1200 × 900 px (4:3)", product: "1200 × 900 px (4:3)" };

/**
 * Bloque de la línea OMBÚ en el inicio. OMBÚ es una marca de terceros que JACOR comercializa:
 * no presentar a JACOR como fabricante, representante exclusivo ni distribuidor oficial sin autorización expresa.
 */
export const OMBU = {
  logo: "/brand/ombu/ombu-logo.png", // logotipo oficial (tomado del folleto del fabricante)
  title: "Indumentaria OMBÚ",
  text: "Conocé nuestra selección de prendas para empresas, industrias y trabajadores de todo el país.",
  href: "/catalogo/?buscar=OMB%C3%9A",
};
