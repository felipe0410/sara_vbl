"use client";

import { useEffect, useRef, useState } from "react";
import { EMAIL } from "@/lib/contacto";

/** Botón "Copiar" del correo: pasa a "Copiado" por 2 segundos. */
export default function CopyMail({ className }: { className?: string }) {
  const [copiado, setCopiado] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(t.current), []);

  function copiar() {
    try {
      navigator.clipboard.writeText(EMAIL).then(() => {
        setCopiado(true);
        clearTimeout(t.current);
        t.current = setTimeout(() => setCopiado(false), 2000);
      }, () => {});
    } catch {}
  }

  return (
    <button type="button" className={className} onClick={copiar}>
      {copiado ? "Copiado" : "Copiar"}
    </button>
  );
}
