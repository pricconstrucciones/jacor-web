import type { Metadata } from "next";
import { LEGAL, LEGAL_PENDING } from "@/lib/legal";

export const metadata: Metadata = { title: "Política de privacidad", alternates: { canonical: "/privacidad/" } };

// BORRADOR redactado según la Ley 25.326 de Protección de los Datos Personales. Debe validarlo un profesional antes de publicar.
export default function Privacidad() {
  return (
    <div className="wrap section legal">
      <h1 className="page-title">Política de privacidad</h1>
      {LEGAL_PENDING && <div className="notice"><b>Borrador.</b> Texto pendiente de completar y de validación legal antes de publicar el sitio.</div>}

      <h2>1. Responsable de los datos</h2>
      <p>{LEGAL.titular}, CUIT {LEGAL.cuit}, con domicilio en {LEGAL.domicilio}. Contacto: {LEGAL.email} · {LEGAL.telefono}.</p>

      <h2>2. Qué datos recolectamos</h2>
      <ul>
        <li>Los que completás en la solicitud de cotización o consulta: nombre y apellido, empresa, CUIT o DNI (opcional), correo, teléfono, provincia, localidad, tu mensaje y los productos, talles y cantidades que nos pedís.</li>
        <li>Datos técnicos mínimos para prevenir abusos: un código derivado de tu dirección IP (no guardamos la dirección) y el tipo de navegador.</li>
      </ul>
      <p>Darnos tus datos es voluntario, pero sin un medio de contacto no podemos responder tu solicitud.</p>

      <h2>3. Para qué los usamos</h2>
      <p>Solo para responder tu solicitud, prepararte una cotización y hacer el seguimiento comercial de esa consulta. No los usamos para otros fines ni los vendemos.</p>

      <h2>4. Con quién los compartimos</h2>
      <p>Con los proveedores técnicos necesarios para que el sitio funcione (alojamiento y verificación anti-robots) y, cuando la operación lo requiera, con el fabricante que provee o factura los productos cotizados. [A confirmar.] No los cedemos a otros terceros salvo obligación legal.</p>

      <h2>5. Cuánto tiempo los conservamos</h2>
      <p>Las solicitudes quedan en el buzón del sitio solo hasta que las ingresamos a nuestro sistema comercial (como máximo 30 días). En el sistema, se conservan por {LEGAL.conservacionSistema}, o hasta que pidas su supresión.</p>

      <h2>6. Tus derechos</h2>
      <p>Podés pedir el acceso, la rectificación, la actualización o la supresión de tus datos escribiendo a {LEGAL.email}. El acceso es gratuito a intervalos no inferiores a seis meses, salvo que acredites un interés legítimo (art. 14, inc. 3, Ley 25.326).</p>
      <p className="muted">La Agencia de Acceso a la Información Pública, en su carácter de órgano de control de la Ley 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes en materia de protección de datos personales.</p>

      <h2>7. Almacenamiento en tu navegador</h2>
      <p>Los productos que agregás a la solicitud se guardan solo en tu navegador hasta que la enviás. No usamos cookies de publicidad ni de seguimiento.</p>

      <h2>8. Seguridad y cambios</h2>
      <p>Aplicamos medidas técnicas y organizativas razonables para proteger tus datos. Si cambiamos esta política, publicaremos la versión actualizada en esta página.</p>
      <p className="muted">Última actualización: {LEGAL.actualizada}.</p>
    </div>
  );
}
