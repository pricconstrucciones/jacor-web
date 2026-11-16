# JACOR Indumentaria Laboral · Web comercial

Sitio público de JACOR (Next.js, exportación estática): catálogo con precios finales (IVA incluido),
galerías por color, carrito y envío de pedidos sujetos a confirmación. No realiza cobros online.

- `npm install` y `npm run dev` → http://127.0.0.1:3100
- Sin un catálogo publicado, el sitio usa los productos de EJEMPLO de `data/catalogo-ejemplo.json`.
- El catálogo real (`data/catalogo.json`) y sus fotos (`public/catalogo/`) los genera el sistema de
  gestión interno con «Publicar catálogo»; no se versionan acá.
- Los pedidos se envían al buzón definido en `NEXT_PUBLIC_SOLICITUDES_URL`. El sitio nunca recibe
  costos, precios mayoristas ni datos internos.

El sistema de gestión (clientes, costos, presupuestos y pedidos) es privado y no forma parte de este repositorio.
