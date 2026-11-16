import Link from "next/link";

/** Tarjeta editorial de categoría: foto grande con el título encima. Sin foto, un fondo de marca (nunca una foto inventada). */
export function CategoryCard({ name, image }: { name: string; image: string | null | undefined }) {
  return (
    <Link className={`cat-card${image ? "" : " cat-card-empty"}`} href={`/catalogo/?categoria=${encodeURIComponent(name)}`}>
      {image ? <img src={image} alt="" width={1200} height={900} loading="lazy" decoding="async" /> : <span className="cat-card-soon">Foto en preparación</span>}
      <span className="cat-card-label">
        <b>{name}</b>
        <span className="cat-card-go">Ver productos <span aria-hidden="true">→</span></span>
      </span>
    </Link>
  );
}
