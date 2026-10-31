// Íconos del sistema: la estrella de espuela ("rowel") y la flecha de enlace externo.
// Los símbolos se definen una vez en el layout y cada ícono los reusa con <use>.

export function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <symbol id="rowel" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M12 1L12.99 9.6L19.78 4.22L14.4 11.01L23 12L14.4 12.99L19.78 19.78L12.99 14.4L12 23L11.01 14.4L4.22 19.78L9.6 12.99L1 12L9.6 11.01L4.22 4.22L11.01 9.6Z M12 10.6a1.4 1.4 0 1 0 0.01 0Z"
        />
      </symbol>
      <symbol id="out" viewBox="0 0 24 24">
        <path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
      </symbol>
    </svg>
  );
}

export function Rowel({ className = "rowel" }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true">
      <use href="#rowel" />
    </svg>
  );
}

export function Out() {
  return (
    <svg className="ico" aria-hidden="true">
      <use href="#out" />
    </svg>
  );
}
