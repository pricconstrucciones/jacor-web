/** Imagen con espacio reservado: si todavía no hay foto, muestra el lugar y la medida sugerida (sin romper el diseño). */
export function ImageSlot({ src, alt, size, className = "" }: { src: string | null | undefined; alt: string; size: string; className?: string }) {
  return (
    <div className={`ph ${src ? "ph-filled " : ""}${className}`}>
      {src ? <img src={src} alt={alt} loading="lazy" /> : <span aria-hidden="true" title={`Medida sugerida: ${size}`}>Foto en preparación</span>}
    </div>
  );
}
