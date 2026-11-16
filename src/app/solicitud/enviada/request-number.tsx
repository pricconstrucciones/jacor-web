"use client";
import { useEffect, useState } from "react";

/** Confirmación de recepción: referencia y estado. Un pedido web nunca es una compra cerrada ni un cobro. */
export function RequestNumber() {
  const [n, setN] = useState<string | null>(null);
  const [order, setOrder] = useState(true);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const v = q.get("n");
    if (v && /^[A-Za-z0-9-]{1,20}$/.test(v)) setN(v);
    setOrder(q.get("t") !== "consulta");
  }, []);
  return order ? (
    <>
      <h1 className="page-title">¡Recibimos tu pedido!</h1>
      {n && <p className="ref-box">Número de referencia: <b>{n}</b></p>}
      <p>Estado: <b>pendiente de confirmación</b>. Vamos a revisarlo y te contactaremos para confirmar disponibilidad, precio final cuando corresponda y condiciones de entrega.</p>
      <p className="muted">No se realizó ningún cobro.</p>
    </>
  ) : (
    <>
      <h1 className="page-title">¡Recibimos tu consulta!</h1>
      {n && <p className="ref-box">Número de referencia: <b>{n}</b></p>}
      <p>Te vamos a responder a la brevedad.</p>
    </>
  );
}
