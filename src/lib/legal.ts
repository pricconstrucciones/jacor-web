// Datos comerciales públicos de JACOR (marca). No son la razón social fiscal: la entidad que factura puede variar
// según la modalidad comercial y se informa en cada presupuesto desde la gestión.
export const COMPANY = {
  name: "JACOR Indumentaria Laboral",
  email: "jacorcba@gmail.com",
  phone: "3512497498", // tal como se muestra al público
  whatsapp: "5493512497498", // formato internacional argentino para wa.me: 54 + 9 + 351 + número
  country: "Argentina",
};
export const mailHref = `mailto:${COMPANY.email}`;
export const whatsappHref = (text?: string) => `https://wa.me/${COMPANY.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
export const telHref = `tel:+54${COMPANY.phone}`;

// Datos legales del sitio: un único lugar para completarlos cuando se decidan (titular, contacto, plazos).
// Mientras tengan «[...]», la web muestra el aviso de borrador y la guía de publicación los marca como pendientes.
export const LEGAL = {
  titular: "[Nombre o razón social del titular]",
  cuit: "[CUIT]",
  domicilio: "[Domicilio]",
  email: COMPANY.email,
  telefono: COMPANY.phone,
  conservacionSistema: "[plazo a definir]", // cuánto se conservan las solicitudes en el sistema comercial
  actualizada: "[fecha de la versión aprobada]",
};

export const LEGAL_PENDING = Object.values(LEGAL).some((v) => v.startsWith("["));
