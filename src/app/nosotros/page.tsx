import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY, whatsappHref } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "JACOR Indumentaria Laboral: una propuesta comercial respaldada por décadas de experiencia familiar en la industria de la indumentaria de trabajo.",
  alternates: { canonical: "/nosotros/" },
};

// La fecha 1978 corresponde a la trayectoria de la empresa familiar de origen, no a la fundación de JACOR.
const VALUES: [string, string][] = [
  ["Conocimiento del producto", "Conocemos cómo se diseña y se confecciona una prenda de trabajo: telas, costuras, talles y terminaciones."],
  ["Calidad", "Elegimos prendas y calzado pensados para el uso intensivo de todos los días."],
  ["Precios competitivos", "Una buena relación entre calidad y precio, para particulares y para compras por volumen."],
  ["Atención personalizada", "Te asesoramos para encontrar la prenda, el talle y la cantidad adecuados para cada necesidad."],
];

export default function Nosotros() {
  return (
    <>
      <section className="about-hero" aria-labelledby="about-titulo">
        <img className="about-hero-img" src="/img/categorias/camisas.webp" alt="" width={1200} height={900} />
        <div className="about-hero-shade" aria-hidden="true" />
        <div className="wrap about-hero-content">
          <span className="hero-ed-rule" aria-hidden="true" />
          <p className="about-kicker">Nosotros</p>
          <h1 id="about-titulo">Experiencia familiar en indumentaria de trabajo</h1>
          <p>Una propuesta respaldada por décadas de experiencia familiar en la industria de la indumentaria laboral.</p>
        </div>
      </section>

      <section className="wrap section about-story" aria-labelledby="historia">
        <div>
          <h2 id="historia">Nuestra historia</h2>
          <p>{COMPANY.name} nace de una historia familiar vinculada al trabajo, la industria y la confección de prendas para quienes hacen que las empresas funcionen todos los días.</p>
          <p>Esa experiencia nos permitió conocer de cerca las necesidades de quienes usan estas prendas: resistencia, comodidad, funcionalidad y una buena relación entre calidad y precio.</p>
          <p>Hoy, desde Córdoba, trasladamos ese conocimiento a JACOR, una propuesta comercial que busca acercar indumentaria laboral y calzado de calidad a empresas, industrias, profesionales y particulares de todo el país.</p>
        </div>
        <ol className="about-timeline" aria-label="Trayectoria">
          <li><b>1978</b><span>Comienza la trayectoria de nuestra empresa familiar de origen, dedicada al desarrollo y la fabricación de indumentaria de trabajo.</span></li>
          <li><b>Décadas de oficio</b><span>Conocimiento directo de la confección y cercanía con el sector productivo.</span></li>
          <li><b>Hoy · JACOR</b><span>Un servicio comercial moderno, ágil y cercano, desde Córdoba para todo el país.</span></li>
        </ol>
      </section>

      <section className="about-band" aria-labelledby="diferenciales">
        <div className="wrap">
          <h2 id="diferenciales">Lo que nos distingue</h2>
          <div className="about-values">
            {VALUES.map(([t, d]) => <div key={t} className="about-value"><b>{t}</b><p>{d}</p></div>)}
          </div>
        </div>
      </section>

      <section className="wrap section grid2" aria-label="A quién atendemos">
        <div className="about-card">
          <h2>Empresas</h2>
          <p>Uniformes para industrias, comercios, oficinas e instituciones: compras por volumen, varios talles por pedido y reposición periódica.</p>
          <Link className="btn btn-dark" href="/empresas/">Soluciones para empresas</Link>
        </div>
        <div className="about-card">
          <h2>Particulares</h2>
          <p>Elegí tu prenda o tu calzado en el catálogo, con precio final, y envianos tu pedido. Lo confirmamos con vos antes de cualquier cobro.</p>
          <Link className="btn btn-outline" href="/catalogo/">Ver catálogo</Link>
        </div>
      </section>

      <section className="wrap section about-close" aria-labelledby="alcance">
        <h2 id="alcance">Llegamos a todo el país</h2>
        <p>Creemos en las relaciones comerciales de largo plazo, la atención personalizada y el asesoramiento para encontrar la solución adecuada en cada necesidad. Nuestro objetivo es combinar la experiencia de una trayectoria familiar en la industria con un servicio comercial moderno, ágil y cercano.</p>
        <p className="about-sign">JACOR. Experiencia que se transforma en confianza.</p>
        <p style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <Link className="btn btn-primary btn-lg" href="/catalogo/">Conocé el catálogo</Link>
          <a className="btn btn-outline btn-lg" href={whatsappHref("Hola JACOR, quiero hacer una consulta.")} target="_blank" rel="noopener noreferrer">Escribinos por WhatsApp</a>
        </p>
      </section>
    </>
  );
}
