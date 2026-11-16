import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap section">
      <h1 className="page-title">Página no encontrada</h1>
      <p>La página que buscás no existe o ya no está publicada.</p>
      <Link className="btn btn-dark" href="/catalogo/">Ver catálogo</Link>
    </div>
  );
}
