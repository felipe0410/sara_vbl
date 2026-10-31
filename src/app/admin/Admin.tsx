"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore/lite";
import { Rowel } from "@/components/icons";
import { auth, db } from "@/lib/firebase";
import { Cat, Contenido, DEFAULTS, DOC_PATH, Video, WesternLink, leerContenido, normalizar } from "@/lib/contenido";

// Debe coincidir con firestore.rules: las reglas son las que de verdad protegen.
const ADMINS = ["saravbl93@gmail.com"];

const CATS: { id: Cat; nombre: string }[] = [
  { id: "beauty", nombre: "Beauty" },
  { id: "fashion", nombre: "Fashion" },
  { id: "lifestyle", nombre: "Lifestyle" },
];

const MUNDOS: { id: keyof Contenido["mundos"]; nombre: string }[] = [
  { id: "beauty", nombre: "Beauty" },
  { id: "fashion", nombre: "Fashion" },
  { id: "lifestyle", nombre: "Lifestyle" },
  { id: "western", nombre: "Western chic" },
];

function errorAuth(code: string) {
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found"))
    return "Correo o contraseña incorrectos.";
  if (code.includes("too-many-requests")) return "Demasiados intentos. Espera unos minutos.";
  if (code.includes("invalid-email")) return "Ese correo no es válido.";
  if (code.includes("network")) return "Sin conexión. Revisa tu internet.";
  return "No se pudo entrar. Intenta de nuevo.";
}

/** Revisa lo que Firestore no puede revisar con gusto: links que no abren y campos vacíos. */
function revisar(c: Contenido): string[] {
  const e: string[] = [];
  const url = (u: string) => /^https:\/\/\S+$/.test(u.trim());
  if (!/^\S+@\S+\.\S+$/.test(c.contacto.email.trim())) e.push("El correo de contacto no es válido.");
  if (!c.contacto.instagram.trim()) e.push("Falta el usuario de Instagram.");
  if (!c.contacto.tiktok.trim()) e.push("Falta el usuario de TikTok.");
  c.videos.forEach((v, i) => {
    if (!v.titulo.trim()) e.push(`Video ${i + 1}: falta el título.`);
    if (!url(v.url)) e.push(`Video ${i + 1}: el link debe empezar con https://`);
  });
  c.western.forEach((w, i) => {
    if (!w.t.trim()) e.push(`Western ${i + 1}: falta el título.`);
    if (!url(w.url)) e.push(`Western ${i + 1}: el link debe empezar con https://`);
  });
  MUNDOS.forEach((m) => {
    if (!url(c.mundos[m.id])) e.push(`Mundo ${m.nombre}: el link debe empezar con https://`);
  });
  return e;
}

export default function Admin() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => onAuthStateChanged(auth(), setUser), []);

  if (user === undefined) return <div className="ad-shell"><p className="ad-muted">Cargando…</p></div>;
  if (!user) return <Login />;
  if (!ADMINS.includes((user.email || "").toLowerCase()))
    return (
      <div className="ad-shell">
        <div className="ad-card ad-login">
          <h1 className="ad-h1">Sin permiso</h1>
          <p>
            La cuenta <strong>{user.email}</strong> no puede editar este sitio.
          </p>
          <button className="btn btn--ghost" onClick={() => signOut(auth())}>
            Salir
          </button>
        </div>
      </div>
    );
  return <Editor user={user} />;
}

function Login() {
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function entrar(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setMsg(null);
    try {
      await signInWithEmailAndPassword(auth(), email.trim(), clave);
    } catch (err) {
      setMsg({ ok: false, t: errorAuth(String((err as { code?: string }).code ?? err)) });
    } finally {
      setEnviando(false);
    }
  }

  async function recuperar() {
    if (!email.trim()) {
      setMsg({ ok: false, t: "Escribe tu correo primero." });
      return;
    }
    try {
      await sendPasswordResetEmail(auth(), email.trim());
    } catch {}
    // Mismo mensaje exista o no la cuenta, para no revelar qué correos están registrados.
    setMsg({ ok: true, t: "Si ese correo tiene acceso, te llegó un enlace para crear tu contraseña. Revisa también spam." });
  }

  return (
    <div className="ad-shell">
      <form className="ad-card ad-login" onSubmit={entrar}>
        <p className="eyebrow">
          <Rowel />
          Sara Valentina
        </p>
        <h1 className="ad-h1">Administrar el sitio</h1>
        <label className="ad-field">
          <span>Correo</span>
          <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="ad-field">
          <span>Contraseña</span>
          <input
            type="password"
            autoComplete="current-password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
          />
        </label>
        {msg && <p className={msg.ok ? "ad-ok" : "ad-err"} role="status">{msg.t}</p>}
        <button className="btn btn--solid" type="submit" disabled={enviando}>
          {enviando ? "Entrando…" : "Entrar"}
        </button>
        <button className="ad-link" type="button" onClick={recuperar}>
          Primera vez u olvidé mi contraseña
        </button>
      </form>
    </div>
  );
}

function Editor({ user }: { user: User }) {
  const [c, setC] = useState<Contenido | null>(null);
  const [base, setBase] = useState<string>("");
  const [estado, setEstado] = useState<{ ok: boolean; t: string } | null>(null);
  const [errores, setErrores] = useState<string[]>([]);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    leerContenido()
      .then((n) => {
        setC(n);
        setBase(JSON.stringify(n));
      })
      .catch(() => {
        setC(DEFAULTS);
        setBase(JSON.stringify(DEFAULTS));
        setEstado({ ok: false, t: "No se pudo leer lo guardado; se muestran los valores originales." });
      });
  }, []);

  const cambios = c !== null && JSON.stringify(c) !== base;

  useEffect(() => {
    if (!cambios) return;
    const aviso = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", aviso);
    return () => window.removeEventListener("beforeunload", aviso);
  }, [cambios]);

  if (!c) return <div className="ad-shell"><p className="ad-muted">Cargando contenido…</p></div>;

  const set = (fn: (d: Contenido) => void) =>
    setC((prev) => {
      const d = structuredClone(prev!);
      fn(d);
      return d;
    });

  async function guardar() {
    // Se revisa lo que está escrito (no lo normalizado), para que una fila a medias no se pierda callada.
    const e = revisar(c!);
    const limpio = normalizar(c);
    setErrores(e);
    if (e.length) {
      setEstado({ ok: false, t: "Revisa los campos marcados antes de guardar." });
      return;
    }
    setGuardando(true);
    setEstado(null);
    try {
      await setDoc(doc(db(), ...DOC_PATH), {
        ...limpio,
        actualizado: serverTimestamp(),
        por: user.email,
      });
      setC(limpio);
      setBase(JSON.stringify(limpio));
      setEstado({
        ok: true,
        t: `Guardado a las ${new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}. Ya se ve en el sitio.`,
      });
    } catch (err) {
      const code = String((err as { code?: string }).code ?? "");
      setEstado({
        ok: false,
        t: code.includes("permission") ? "Tu cuenta no tiene permiso para guardar." : "No se pudo guardar. Revisa tu internet e intenta otra vez.",
      });
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="ad-page">
      <header className="ad-top">
        <div className="ad-top__in">
          <span className="brand">
            <Rowel />
            Admin
          </span>
          <nav>
            <a href="/" target="_blank" rel="noopener">
              Ver landing ↗
            </a>
            <a href="/media-kit/" target="_blank" rel="noopener">
              Ver media kit ↗
            </a>
            <button type="button" onClick={() => signOut(auth())}>
              Salir
            </button>
          </nav>
        </div>
      </header>

      <main className="ad-main">
        <h1 className="ad-h1">Contenido del sitio</h1>
        <p className="ad-muted">
          Lo que cambies aquí aparece en la landing y el media kit al guardar. Las fotos se cambian aparte.
        </p>

        <Seccion titulo="Contacto y redes">
          <Campo label="Correo de contacto" value={c.contacto.email} onChange={(v) => set((d) => (d.contacto.email = v))} type="email" />
          <Campo
            label="Usuario de Instagram"
            hint="Sin @ ni link. Ej: svalentinee"
            value={c.contacto.instagram}
            onChange={(v) => set((d) => (d.contacto.instagram = v.replace(/^@/, "")))}
          />
          <Campo
            label="Usuario de TikTok"
            hint="Sin @ ni link"
            value={c.contacto.tiktok}
            onChange={(v) => set((d) => (d.contacto.tiktok = v.replace(/^@/, "")))}
          />
        </Seccion>

        <Seccion titulo="Cifras de TikTok" nota="Escríbelas como quieres que se vean: 18,1K · 927,7K. Los porcentajes, solo el número (74 o 57,8).">
          <Campo label="Seguidores" value={c.tiktok.seguidores} onChange={(v) => set((d) => (d.tiktok.seguidores = v))} />
          <Campo label="Visualizaciones · 365 días" value={c.tiktok.vistas365} onChange={(v) => set((d) => (d.tiktok.vistas365 = v))} />
          <Campo label="Espectadores · 365 días" value={c.tiktok.espectadores365} onChange={(v) => set((d) => (d.tiktok.espectadores365 = v))} />
          <Campo label="% espectadores mujeres" value={c.tiktok.mujeres} onChange={(v) => set((d) => (d.tiktok.mujeres = v))} pct />
          <Campo label="% seguidores en Colombia" value={c.tiktok.colombia} onChange={(v) => set((d) => (d.tiktok.colombia = v))} pct />
          <Campo label="% espectadores de 25 a 34" value={c.tiktok.edad2534} onChange={(v) => set((d) => (d.tiktok.edad2534 = v))} pct />
        </Seccion>

        <Seccion titulo="Cifras de Instagram">
          <Campo label="Seguidores" value={c.instagram.seguidores} onChange={(v) => set((d) => (d.instagram.seguidores = v))} />
          <Campo label="Visualizaciones · 30 días" value={c.instagram.vistas30} onChange={(v) => set((d) => (d.instagram.vistas30 = v))} />
          <Campo label="Visualizaciones · 90 días" value={c.instagram.vistas90} onChange={(v) => set((d) => (d.instagram.vistas90 = v))} />
          <Campo label="% audiencia en Colombia" value={c.instagram.colombia} onChange={(v) => set((d) => (d.instagram.colombia = v))} pct />
          <Campo label="% audiencia de 25 a 34" value={c.instagram.edad2534} onChange={(v) => set((d) => (d.instagram.edad2534 = v))} pct />
        </Seccion>

        <Seccion titulo="Media kit">
          <Campo label="Año del media kit" value={c.anio} onChange={(v) => set((d) => (d.anio = v))} />
          <Campo label="Nota bajo las métricas" value={c.nota} onChange={(v) => set((d) => (d.nota = v))} ancho />
        </Seccion>

        <Seccion titulo="Videos del portafolio" nota="Salen en la lista del media kit y se filtran por categoría.">
          <Lista
            items={c.videos}
            vacio={(): Video => ({ cat: "beauty", tipo: "Beauty · ", titulo: "", url: "" })}
            onChange={(items) => set((d) => (d.videos = items))}
            fila={(v, cambiar) => (
              <>
                <label className="ad-field">
                  <span>Categoría</span>
                  <select value={v.cat} onChange={(e) => cambiar({ ...v, cat: e.target.value as Cat })}>
                    {CATS.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.nombre}
                      </option>
                    ))}
                  </select>
                </label>
                <Campo label="Etiqueta" hint="Ej: Beauty · Tutorial" value={v.tipo} onChange={(x) => cambiar({ ...v, tipo: x })} />
                <Campo label="Título" value={v.titulo} onChange={(x) => cambiar({ ...v, titulo: x })} />
                <Campo label="Link del video" value={v.url} onChange={(x) => cambiar({ ...v, url: x })} type="url" ancho />
              </>
            )}
          />
        </Seccion>

        <Seccion titulo="Videos de western" nota="La lista de la sección Western chic del media kit.">
          <Lista
            items={c.western}
            vacio={(): WesternLink => ({ k: "", t: "", viral: false, url: "" })}
            onChange={(items) => set((d) => (d.western = items))}
            fila={(w, cambiar) => (
              <>
                <Campo label="Etiqueta" hint="Ej: Storytime" value={w.k} onChange={(x) => cambiar({ ...w, k: x })} />
                <Campo label="Título" value={w.t} onChange={(x) => cambiar({ ...w, t: x })} />
                <label className="ad-check">
                  <input type="checkbox" checked={w.viral} onChange={(e) => cambiar({ ...w, viral: e.target.checked })} />
                  <span>Marcar como viral</span>
                </label>
                <Campo label="Link del video" value={w.url} onChange={(x) => cambiar({ ...w, url: x })} type="url" ancho />
              </>
            )}
          />
        </Seccion>

        <Seccion titulo="Los cuatro mundos (landing)" nota="El video que abre cada foto de la sección Mi contenido.">
          {MUNDOS.map((m) => (
            <Campo
              key={m.id}
              label={m.nombre}
              value={c.mundos[m.id]}
              onChange={(v) => set((d) => (d.mundos[m.id] = v))}
              type="url"
              ancho
            />
          ))}
        </Seccion>

        <Seccion titulo="Marcas y formatos">
          <Lineas
            label="Marcas"
            hint="Una por línea. Salen en la landing y en el media kit."
            items={c.marcas}
            onChange={(v) => set((d) => (d.marcas = v))}
          />
          <Lineas
            label="Formatos (landing)"
            hint="Una por línea."
            items={c.formatos}
            onChange={(v) => set((d) => (d.formatos = v))}
          />
        </Seccion>

        {errores.length > 0 && (
          <ul className="ad-errors" role="alert">
            {errores.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        )}
      </main>

      <div className="ad-bar">
        <div className="ad-bar__in">
          <p className={estado ? (estado.ok ? "ad-ok" : "ad-err") : "ad-muted"} role="status">
            {estado?.t ?? (cambios ? "Tienes cambios sin guardar." : "Todo guardado.")}
          </p>
          <div className="ad-bar__btns">
            <button
              className="btn btn--ghost"
              type="button"
              disabled={!cambios || guardando}
              onClick={() => {
                setC(JSON.parse(base));
                setErrores([]);
                setEstado(null);
              }}
            >
              Descartar
            </button>
            <button className="btn btn--solid" type="button" disabled={!cambios || guardando} onClick={guardar}>
              {guardando ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Seccion({ titulo, nota, children }: { titulo: string; nota?: string; children: React.ReactNode }) {
  return (
    <section className="ad-card ad-sec">
      <h2>{titulo}</h2>
      {nota && <p className="ad-muted">{nota}</p>}
      <div className="ad-grid">{children}</div>
    </section>
  );
}

function Campo({
  label,
  hint,
  value,
  onChange,
  type = "text",
  ancho,
  pct,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  ancho?: boolean;
  pct?: boolean;
}) {
  return (
    <label className={`ad-field${ancho ? " ad-field--full" : ""}`}>
      <span>{label}</span>
      <span className={pct ? "ad-pct" : undefined}>
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} inputMode={pct ? "decimal" : undefined} />
      </span>
      {hint && <small>{hint}</small>}
    </label>
  );
}

function Lineas({ label, hint, items, onChange }: { label: string; hint: string; items: string[]; onChange: (v: string[]) => void }) {
  // Se edita como texto libre y se parte en líneas al escribir; las vacías se quitan al guardar.
  const [texto, setTexto] = useState(items.join("\n"));
  useEffect(() => {
    if (texto.split("\n").map((x) => x.trim()).filter(Boolean).join("\n") !== items.join("\n")) setTexto(items.join("\n"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);
  return (
    <label className="ad-field">
      <span>{label}</span>
      <textarea
        rows={Math.max(5, items.length + 1)}
        value={texto}
        onChange={(e) => {
          setTexto(e.target.value);
          onChange(e.target.value.split("\n").map((x) => x.trim()).filter(Boolean));
        }}
      />
      <small>{hint}</small>
    </label>
  );
}

function Lista<T>({
  items,
  vacio,
  onChange,
  fila,
}: {
  items: T[];
  vacio: () => T;
  onChange: (items: T[]) => void;
  fila: (item: T, cambiar: (n: T) => void) => React.ReactNode;
}) {
  const mover = (i: number, d: number) => {
    const n = [...items];
    const [x] = n.splice(i, 1);
    n.splice(i + d, 0, x);
    onChange(n);
  };
  return (
    <div className="ad-list">
      {items.map((it, i) => (
        <div className="ad-item" key={i}>
          <div className="ad-item__head">
            <strong>#{i + 1}</strong>
            <div>
              <button type="button" onClick={() => mover(i, -1)} disabled={i === 0} aria-label="Subir">
                ↑
              </button>
              <button type="button" onClick={() => mover(i, 1)} disabled={i === items.length - 1} aria-label="Bajar">
                ↓
              </button>
              <button type="button" className="ad-del" onClick={() => onChange(items.filter((_, j) => j !== i))}>
                Quitar
              </button>
            </div>
          </div>
          <div className="ad-grid">{fila(it, (n) => onChange(items.map((x, j) => (j === i ? n : x))))}</div>
        </div>
      ))}
      <button type="button" className="btn btn--ghost" onClick={() => onChange([...items, vacio()])}>
        + Agregar
      </button>
    </div>
  );
}
