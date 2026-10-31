"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Out, Rowel } from "@/components/icons";
import { EMAIL, HANDLE, INSTAGRAM, INSTAGRAM_DM, TIKTOK } from "@/lib/contacto";

type Cat = "beauty" | "fashion" | "lifestyle";
type Filtro = Cat | "all";

const VIDEOS: { cat: Cat; tipo: string; titulo: string; url: string }[] = [
  { cat: "beauty", tipo: "Beauty · Tutorial", titulo: "Tutorial de maquillaje", url: "https://vt.tiktok.com/ZSgm7SX9H/" },
  { cat: "beauty", tipo: "Beauty · Reseña", titulo: "Reseña de belleza", url: "https://vt.tiktok.com/ZSgm7joy8/" },
  { cat: "beauty", tipo: "Beauty · Skincare", titulo: "Reseña de skincare", url: "https://vt.tiktok.com/ZSgm7y2RG/" },
  { cat: "fashion", tipo: "Fashion · Unboxing", titulo: "Unboxing de moda", url: "https://vt.tiktok.com/ZSgm7Nv6F/" },
  { cat: "fashion", tipo: "Fashion · Editorial", titulo: "Fashion editorial", url: "https://vt.tiktok.com/ZSgm75avT/" },
  { cat: "lifestyle", tipo: "Lifestyle · GRWM", titulo: "Get ready with me", url: "https://vt.tiktok.com/ZSgm7fQLH/" },
];

const TILES: { cat: Cat; nombre: string; img: string; w: number }[] = [
  { cat: "fashion", nombre: "Fashion", img: "/img/fashion.jpg", w: 410 },
  { cat: "beauty", nombre: "Beauty", img: "/img/beauty.jpg", w: 410 },
  { cat: "lifestyle", nombre: "Lifestyle", img: "/img/lifestyle.jpg", w: 412 },
];

const FILTROS: { id: Filtro; nombre: string }[] = [
  { id: "all", nombre: "Todo" },
  { id: "beauty", nombre: "Beauty" },
  { id: "fashion", nombre: "Fashion" },
  { id: "lifestyle", nombre: "Lifestyle" },
];

const PEEK: Record<Cat, string> = {
  beauty: "/img/beauty.jpg",
  fashion: "/img/fashion.jpg",
  lifestyle: "/img/lifestyle.jpg",
};

const WESTERN = [
  { k: "Storytime", t: "Historia", viral: true, url: "https://vt.tiktok.com/ZSgm7kqmu/" },
  { k: "Western chic", t: "Equitación", url: "https://vt.tiktok.com/ZSgm7DEPR/" },
  { k: "Western life", t: "Vlog de campo", url: "https://vt.tiktok.com/ZSgm72mUU/" },
  { k: "Vlog", t: "Vlog de viaje", url: "https://vt.tiktok.com/ZSgm7htT3/" },
];

const FORMATOS = [
  { id: "tiktok", v: "TikTok patrocinado" },
  { id: "reels", v: "Instagram Reels" },
  { id: "stories", v: "Instagram Stories" },
  { id: "ugc", v: "Video UGC" },
  { id: "resena", v: "Reseña o unboxing" },
  { id: "grwm", v: "GRWM o tutorial" },
  { id: "styling", v: "Estilismo y outfits" },
  { id: "vlog", v: "Vlog o viaje" },
  { id: "evento", v: "Evento o visita de marca" },
];

const SERVICIOS = [
  { titulo: "Social media", items: ["TikTok patrocinado", "Instagram Reels", "Instagram Stories"], preset: ["tiktok", "reels", "stories"] },
  { titulo: "UGC & producto", items: ["Videos UGC", "Reseñas", "Unboxing", "Demos y tutoriales"], preset: ["ugc", "resena"] },
  { titulo: "Beauty & fashion", items: ["GRWM", "Maquillaje", "Skincare", "Estilismo y outfits"], preset: ["grwm", "styling"] },
  { titulo: "Lifestyle & experiencias", items: ["Vlogs", "Lugares y viajes", "Eventos", "Visitas a marcas"], preset: ["vlog", "evento"] },
];

const COPIA_FALLA = "Quedó seleccionado: cópialo con Ctrl+C o mantén presionado.";

function reduceMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function seleccionar(node: HTMLElement | null) {
  if (!node) return;
  try {
    if (node instanceof HTMLTextAreaElement || node instanceof HTMLInputElement) {
      node.focus();
      node.select();
      return;
    }
    const r = document.createRange();
    r.selectNodeContents(node);
    const s = window.getSelection();
    s?.removeAllRanges();
    s?.addRange(r);
  } catch {}
}

/** Copia al portapapeles; si el navegador no deja, selecciona el texto para copiarlo a mano. */
async function copiar(texto: string, node: HTMLElement | null): Promise<boolean> {
  try {
    if (!navigator.clipboard) throw new Error("sin portapapeles");
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    seleccionar(node);
    return false;
  }
}

export default function MediaKit() {
  const [filtro, setFiltro] = useState<Filtro>("all");
  const [mailStatus, setMailStatus] = useState("");

  // formulario
  const [nombre, setNombre] = useState("");
  const [marca, setMarca] = useState("");
  const [correo, setCorreo] = useState("");
  const [idea, setIdea] = useState("");
  const [formatos, setFormatos] = useState<Set<string>>(new Set());
  const [error, setError] = useState(false);
  const [mensaje, setMensaje] = useState<{ texto: string; asunto: string } | null>(null);
  const [msgStatus, setMsgStatus] = useState<React.ReactNode>(null);

  const [dockAway, setDockAway] = useState(false);
  const [peek, setPeek] = useState<{ src: string; x: number; y: number; on: boolean } | null>(null);
  const [hoverFino, setHoverFino] = useState(false);

  const mailRef = useRef<HTMLSpanElement>(null);
  const indexRef = useRef<HTMLOListElement>(null);
  const contactoRef = useRef<HTMLElement>(null);
  const nombreRef = useRef<HTMLInputElement>(null);
  const marcaRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const outRef = useRef<HTMLTextAreaElement>(null);

  const conteo = useMemo(() => {
    const c: Record<Filtro, number> = { all: VIDEOS.length, beauty: 0, fashion: 0, lifestyle: 0 };
    VIDEOS.forEach((v) => c[v.cat]++);
    return c;
  }, []);

  // El dock del celular se esconde cuando el contacto está en pantalla.
  useEffect(() => {
    const el = contactoRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => entries.forEach((en) => setDockAway(en.isIntersecting)), {
      threshold: 0.08,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // La vista previa de foto al pasar por el índice solo tiene sentido con mouse.
  useEffect(() => {
    setHoverFino(!!window.matchMedia?.("(hover: hover) and (pointer: fine)").matches);
  }, []);

  // Cuando aparece el mensaje armado, se desplaza hasta él.
  useEffect(() => {
    if (mensaje) resultRef.current?.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "nearest" });
  }, [mensaje]);

  function tocarTile(cat: Cat) {
    setFiltro(filtro === cat ? "all" : cat);
    indexRef.current?.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "nearest" });
  }

  async function copiarCorreo() {
    const ok = await copiar(EMAIL, mailRef.current);
    setMailStatus(ok ? "Correo copiado." : COPIA_FALLA);
  }

  function alternarFormato(v: string) {
    setFormatos((prev) => {
      const n = new Set(prev);
      if (n.has(v)) n.delete(v);
      else n.add(v);
      return n;
    });
  }

  function proponer(preset: string[]) {
    setFormatos((prev) => {
      const n = new Set(prev);
      preset.forEach((id) => {
        const f = FORMATOS.find((x) => x.id === id);
        if (f) n.add(f.v);
      });
      return n;
    });
    contactoRef.current?.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth" });
    setTimeout(() => {
      try {
        nombreRef.current?.focus({ preventScroll: true });
      } catch {
        nombreRef.current?.focus();
      }
    }, reduceMotion() ? 0 : 600);
  }

  function armar(e: FormEvent) {
    e.preventDefault();
    const n = nombre.trim();
    const m = marca.trim();
    if (!n || !m) {
      setError(true);
      (n ? marcaRef : nombreRef).current?.focus();
      return;
    }
    setError(false);
    // Respeta el orden de los chips, no el orden en que se marcaron.
    const fmts = FORMATOS.map((f) => f.v).filter((v) => formatos.has(v));
    const lines = ["Hola Sara,", "", `Soy ${n}, de ${m}. Me gustaría proponerte una colaboración.`];
    if (fmts.length) lines.push("", `Formatos de interés: ${fmts.join(", ")}.`);
    if (idea.trim()) lines.push("", idea.trim());
    if (correo.trim()) lines.push("", `Puedes responderme a ${correo.trim()}.`);
    lines.push("", "Gracias,", n);
    setMensaje({ texto: lines.join("\n"), asunto: `Colaboración con ${m}` });
    setMsgStatus(null);
  }

  async function copiarMensaje() {
    if (!mensaje) return;
    const ok = await copiar(mensaje.texto, outRef.current);
    setMsgStatus(
      ok ? (
        <>
          <strong>Mensaje copiado.</strong> Pégalo en un correo a {EMAIL} o en un DM de Instagram.
        </>
      ) : (
        COPIA_FALLA
      )
    );
  }

  function abrirDM() {
    if (!mensaje || !navigator.clipboard) return;
    navigator.clipboard.writeText(mensaje.texto).then(
      () =>
        setMsgStatus(
          <>
            <strong>Mensaje copiado.</strong> Pégalo en el chat de Instagram que se abrió.
          </>
        ),
      () => {}
    );
  }

  const mailHref = mensaje
    ? `mailto:${EMAIL}?subject=${encodeURIComponent(mensaje.asunto)}&body=${encodeURIComponent(mensaje.texto)}`
    : `mailto:${EMAIL}`;

  return (
    <>
      <header className="topbar">
        <div className="wrap">
          <a className="brand" href="#inicio">
            <Rowel />
            Sara Valentina
          </a>
          <nav className="nav" aria-label="Secciones">
            <a href="#sobre-mi">Sobre mí</a>
            <a href="#comunidad">Comunidad</a>
            <a href="#portafolio">Portafolio</a>
            <a href="#western">Western</a>
            <a href="#colaboraciones">Colaboraciones</a>
          </nav>
          <a className="btn btn--cream" href="#contacto">
            Contacto
          </a>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero" id="inicio">
          <div className="wrap hero__grid">
            <div className="hero__head">
              <p className="issue">
                <span>
                  <Rowel />
                  Creator portfolio
                </span>
                <span>Media kit 2026</span>
              </p>
              <h1 className="mast">
                <span>Sara</span>
                <em>Valentina</em>
              </h1>
            </div>

            <figure className="hero__photo">
              <div className="arch">
                <div className="arch__img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/img/cover.jpg"
                    width={1100}
                    height={1555}
                    alt="Sara Valentina de noche con gabardina beige, guantes largos de cuero y falda con estampado de vaca, frente a una catedral iluminada"
                    fetchPriority="high"
                  />
                </div>
              </div>
              <figcaption>
                <span>Bogotá</span>
                <span>Boyacá</span>
                <span>Llanos Orientales</span>
              </figcaption>
            </figure>

            <div className="hero__body">
              <p className="tags">
                Beauty <Rowel /> Fashion <Rowel /> Lifestyle <Rowel /> Western chic
              </p>
              <p className="hero__lede">
                Moda, belleza y lifestyle con estética editorial, en una mirada que viaja de la ciudad al campo colombiano.
              </p>
              <div className="ctas">
                <a className="btn btn--cream" href="#contacto">
                  Trabajemos juntas
                </a>
                <a className="btn btn--line" href="#portafolio">
                  Ver portafolio
                </a>
              </div>
            </div>
          </div>

          <div className="wrap">
            <ul className="coverlines" aria-label="Cifras destacadas">
              <li>
                <b>18,1K</b>
                <span>seguidores en TikTok</span>
              </li>
              <li>
                <b>927,7K</b>
                <span>visualizaciones en TikTok en los últimos 365 días</span>
              </li>
              <li>
                <b>79,3 %</b>
                <span>de mi audiencia de Instagram está en Colombia</span>
              </li>
            </ul>
          </div>
        </section>

        {/* ABOUT */}
        <section className="sec" id="sobre-mi">
          <div className="wrap about">
            <figure className="about__photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/about.jpg"
                width={610}
                height={1235}
                alt="Sara Valentina sentada, con vestido rosa palo, gafas doradas y botas de cuero vinotinto"
                loading="lazy"
              />
              <figcaption className="cap-tab">
                Fashion <Rowel /> Beauty <Rowel /> Western chic
              </figcaption>
            </figure>
            <div className="about__text">
              <p className="eyebrow">
                <Rowel />
                About me
              </p>
              <h2 className="h2">
                Hola, soy <em>Sara Valentina</em>
              </h2>
              <p>
                Soy creadora de contenido colombiana, apasionada por la moda, la belleza y el lifestyle. Me gusta transformar
                experiencias cotidianas en historias visuales, recomendaciones cercanas y contenido con identidad.
              </p>
              <p>
                Estoy basada en Bogotá y viajo frecuentemente a Boyacá y los Llanos Orientales, territorios ligados a mis raíces
                familiares y a mi forma de entender el estilo.
              </p>
              <p>
                Mi sello combina feminidad, estética editorial, espontaneidad frente a la cámara y una conexión especial con el
                universo western chic.
              </p>
              <blockquote className="pull">Creo contenido para inspirar, conectar y contar historias.</blockquote>
              <p className="small">
                Además de beauty y fashion, comparto vlogs, cultura, música y experiencias que reflejan mi personalidad más allá
                de una sola categoría.
              </p>
            </div>
          </div>
        </section>

        {/* COMMUNITY */}
        <section className="sec community" id="comunidad">
          <div className="wrap">
            <header className="sec-head">
              <p className="eyebrow">
                <Rowel />
                My community
              </p>
              <h2 className="h2">
                Una audiencia mayoritariamente <em>colombiana</em>
              </h2>
            </header>

            <div className="platforms">
              <article className="platform">
                <div className="platform__top">
                  <h3>TikTok</h3>
                  <a href={TIKTOK} target="_blank" rel="noopener">
                    {HANDLE} <Out />
                  </a>
                </div>
                <p className="big">
                  <b>18,1K</b>
                  <span>seguidores</span>
                </p>
                <dl className="kpis">
                  <div>
                    <dt>Visualizaciones · 365 días</dt>
                    <dd>927,7K</dd>
                  </div>
                  <div>
                    <dt>Espectadores · 365 días</dt>
                    <dd>753,3K</dd>
                  </div>
                </dl>
                <p className="label meters-label">Audiencia</p>
                <Meters
                  items={[
                    ["Espectadores mujeres", "74 %", 74],
                    ["Seguidores en Colombia", "57,8 %", 57.8],
                    ["Espectadores de 25 a 34 años", "52,3 %", 52.3],
                  ]}
                />
              </article>

              <article className="platform">
                <div className="platform__top">
                  <h3>Instagram</h3>
                  <a href={INSTAGRAM} target="_blank" rel="noopener">
                    {HANDLE} <Out />
                  </a>
                </div>
                <p className="big">
                  <b>5.612</b>
                  <span>seguidores</span>
                </p>
                <dl className="kpis">
                  <div>
                    <dt>Visualizaciones · 30 días</dt>
                    <dd>44.574</dd>
                  </div>
                  <div>
                    <dt>Visualizaciones · 90 días</dt>
                    <dd>104.872</dd>
                  </div>
                </dl>
                <p className="label meters-label">Audiencia</p>
                <Meters
                  items={[
                    ["Audiencia en Colombia", "79,3 %", 79.3],
                    ["Audiencia de 25 a 34 años", "34,8 %", 34.8],
                  ]}
                />
              </article>
            </div>
            <p className="source">Métricas tomadas de las estadísticas de cada plataforma, 2026.</p>
          </div>
        </section>

        {/* PORTFOLIO */}
        <section className="sec" id="portafolio">
          <div className="wrap">
            <header className="sec-head">
              <p className="eyebrow">
                <Rowel />
                Creative portfolio
              </p>
              <h2 className="h2">
                Video-first <em>storytelling</em>
              </h2>
              <p className="lead">
                Manejo formatos de diálogo a cámara, tutoriales, reseñas, integración de productos, styling, video estético y
                contenido espontáneo. Elige una categoría y abre cada video en TikTok.
              </p>
            </header>

            <div className="tiles">
              {TILES.map((t) => (
                <button
                  key={t.cat}
                  className="tile"
                  type="button"
                  aria-pressed={filtro === t.cat}
                  aria-label={`Ver videos de ${t.nombre}`}
                  onClick={() => tocarTile(t.cat)}
                >
                  <div className="tile__img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.img} width={t.w} height={670} alt="" loading="lazy" />
                  </div>
                  <div className="tile__cap">
                    <strong>{t.nombre}</strong>
                    <span>
                      {conteo[t.cat]} {conteo[t.cat] === 1 ? "video" : "videos"}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="filters" role="group" aria-label="Filtrar videos por categoría">
              {FILTROS.map((f) => (
                <button key={f.id} type="button" aria-pressed={filtro === f.id} onClick={() => setFiltro(f.id)}>
                  {f.nombre}
                  <small> {conteo[f.id]}</small>
                </button>
              ))}
            </div>

            <ol className="index" id="index" ref={indexRef}>
              {VIDEOS.map((v) => (
                <li key={v.url} data-cat={v.cat} hidden={!(filtro === "all" || filtro === v.cat)}>
                  <a
                    className="row"
                    href={v.url}
                    target="_blank"
                    rel="noopener"
                    onMouseEnter={hoverFino ? (e) => setPeek({ src: PEEK[v.cat], x: e.clientX, y: e.clientY, on: true }) : undefined}
                    onMouseMove={hoverFino ? (e) => setPeek({ src: PEEK[v.cat], x: e.clientX, y: e.clientY, on: true }) : undefined}
                    onMouseLeave={hoverFino ? () => setPeek((p) => (p ? { ...p, on: false } : null)) : undefined}
                  >
                    <span className="row__cat">{v.tipo}</span>
                    <span className="row__title">{v.titulo}</span>
                    <span className="row__go">
                      <span>TikTok</span>
                      <Out />
                    </span>
                  </a>
                </li>
              ))}
            </ol>
            <div className="portfolio-note">
              <p>Contenido visual, comunicación cercana y estética propia.</p>
              <a className="btn btn--ghost" href={TIKTOK} target="_blank" rel="noopener">
                Ver todo en TikTok <Out />
              </a>
            </div>
          </div>
        </section>

        {/* WESTERN */}
        <section className="sec on-band" id="western">
          <div className="wrap western">
            <div className="western__text">
              <p className="eyebrow">
                <Rowel />
                My creative world
              </p>
              <h2 className="h2">
                Western chic, <em>identidad colombiana</em>
              </h2>
              <p className="tagline">Una estética que viaja de la ciudad al campo colombiano.</p>
              <p>
                Desde Boyacá y los Llanos Orientales hasta nuevas experiencias y destinos, el viaje, la vida de campo y la moda
                hacen parte de mi identidad creativa.
              </p>
              <ul className="wlinks">
                {WESTERN.map((w) => (
                  <li key={w.url}>
                    <a href={w.url} target="_blank" rel="noopener">
                      <span>
                        <span className="k">{w.k}</span>
                        <span className="t">
                          {w.t}
                          {w.viral && <span className="badge">Viral</span>}
                        </span>
                      </span>
                      <span className="go">
                        <Out />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="collage">
              <div className="arch">
                <div className="arch__img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/img/western-retrato.jpg"
                    width={677}
                    height={1105}
                    alt="Retrato de Sara Valentina con sombrero vaquero claro y pañoleta naranja, con montañas al fondo"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="sq sq--a">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/img/western-caballo.jpg"
                  width={585}
                  height={657}
                  alt="Sara Valentina montando a caballo en un desfile en la calle de un pueblo"
                  loading="lazy"
                />
              </div>
              <div className="sq sq--b">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/img/western-calle.jpg"
                  width={585}
                  height={417}
                  alt="Sara Valentina sonriendo con sombrero vaquero, con jinetes al fondo"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* COLLABORATIONS */}
        <section className="sec" id="colaboraciones">
          <div className="wrap">
            <header className="sec-head">
              <p className="eyebrow">
                <Rowel />
                Let’s collaborate
              </p>
              <h2 className="h2">
                Campañas creativas para <em>marcas, productos y experiencias</em>
              </h2>
            </header>

            <div className="collab">
              <div className="collab__exp">
                <p className="label">Experiencia</p>
                <p>
                  He desarrollado contenido en formatos UGC, canjes y colaboraciones remuneradas, además de recomendaciones y
                  publicaciones orgánicas sobre productos que forman parte de mi día a día.
                </p>
                <p className="small">
                  También comparto recomendaciones de belleza, maquillaje y experiencias de compra, incluyendo contenido
                  relacionado con Aruma.
                </p>
              </div>
              <div className="brands-box">
                <p className="label">Marcas presentes en mi experiencia y contenido</p>
                <ul className="brands">
                  {["Vichy", "Animus Lab", "La Roche-Posay", "Dermohelp", "Numbuzin"].map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="services">
              {SERVICIOS.map((s) => (
                <article className="service" key={s.titulo}>
                  <Rowel />
                  <h3>{s.titulo}</h3>
                  <ul>
                    {s.items.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                  <button type="button" onClick={() => proponer(s.preset)}>
                    Proponer <Out />
                  </button>
                </article>
              ))}
            </div>
            <p className="services-note">
              Cada propuesta se adapta a la identidad de la marca, la plataforma, el formato creativo y los objetivos de la
              campaña.
            </p>
          </div>
        </section>

        {/* CONTACT */}
        <section className="sec contact-band" id="contacto" ref={contactoRef}>
          <div className="wrap contact">
            <div className="contact__intro">
              <p className="eyebrow">
                <Rowel />
                Booking &amp; collaborations
              </p>
              <h2 className="contact__title">
                Let’s create <em>something beautiful.</em>
              </h2>
              <ul className="direct">
                <li>
                  <span className="k">Correo</span>
                  <span className="v v--mail" ref={mailRef}>
                    {EMAIL}
                  </span>
                  <button className="copy" type="button" onClick={copiarCorreo}>
                    Copiar
                  </button>
                </li>
                <li>
                  <span className="k">Instagram</span>
                  <a className="v" href={INSTAGRAM} target="_blank" rel="noopener">
                    {HANDLE} <Out />
                  </a>
                  <span></span>
                </li>
                <li>
                  <span className="k">TikTok</span>
                  <a className="v" href={TIKTOK} target="_blank" rel="noopener">
                    {HANDLE} <Out />
                  </a>
                  <span></span>
                </li>
              </ul>
              <p className="status status--band" aria-live="polite">
                {mailStatus}
              </p>
              <figure className="contact__photo">
                <div className="arch">
                  <div className="arch__img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/img/contacto.jpg"
                      width={900}
                      height={1273}
                      alt="Sara Valentina de noche con vestido blanco y pañoleta vinotinto de lunares"
                      loading="lazy"
                    />
                  </div>
                </div>
              </figure>
            </div>

            <form className="brief" noValidate onSubmit={armar}>
              <h3>Cuéntame sobre tu marca</h3>
              <p className="intro">Arma tu propuesta aquí y te dejo el mensaje listo para enviarlo por correo o por DM.</p>
              <div className="fields">
                <div className="field">
                  <label htmlFor="f-nombre">Tu nombre</label>
                  <input
                    id="f-nombre"
                    ref={nombreRef}
                    type="text"
                    autoComplete="name"
                    placeholder="Ej. Laura Gómez"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="f-marca">Marca o empresa</label>
                  <input
                    id="f-marca"
                    ref={marcaRef}
                    type="text"
                    autoComplete="organization"
                    placeholder="Ej. Tu marca"
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                  />
                </div>
                <div className="field field--full">
                  <label htmlFor="f-correo">Correo para responderte</label>
                  <input
                    id="f-correo"
                    type="email"
                    autoComplete="email"
                    placeholder="nombre@marca.com"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                  />
                </div>
              </div>

              <fieldset>
                <legend>Formatos que te interesan</legend>
                <div className="chips">
                  {FORMATOS.map((f) => (
                    <label className="chip" key={f.id}>
                      <input
                        type="checkbox"
                        id={`fmt-${f.id}`}
                        value={f.v}
                        checked={formatos.has(f.v)}
                        onChange={() => alternarFormato(f.v)}
                      />
                      <span>{f.v}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="field">
                <label htmlFor="f-msg">Cuéntame la idea</label>
                <textarea
                  id="f-msg"
                  rows={4}
                  placeholder="Producto, fechas, objetivo de la campaña…"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                />
              </div>

              <p className="error" role="alert" hidden={!error}>
                Escribe tu nombre y el de tu marca para armar el mensaje.
              </p>

              <div className="brief__submit">
                <button className="btn btn--solid" type="submit">
                  Preparar mensaje
                </button>
                <span className="small">Nada se envía hasta que tú lo mandes.</span>
              </div>

              <div className="result" ref={resultRef} hidden={!mensaje}>
                <p className="result__title">
                  <Rowel />
                  Tu mensaje está listo
                </p>
                <label className="label" htmlFor="f-out">
                  Mensaje para Sara
                </label>
                <textarea className="out" id="f-out" ref={outRef} readOnly value={mensaje?.texto ?? ""} />
                <div className="result__actions">
                  <button className="btn btn--solid" type="button" onClick={copiarMensaje}>
                    Copiar mensaje
                  </button>
                  <a className="btn btn--ghost" href={mailHref}>
                    Abrir en mi correo
                  </a>
                  <a className="btn btn--ghost" href={INSTAGRAM_DM} target="_blank" rel="noopener" onClick={abrirDM}>
                    Enviar por DM
                  </a>
                </div>
                <p className="status" aria-live="polite">
                  {msgStatus ?? (
                    <>
                      Envíalo a <strong>{EMAIL}</strong> o pégalo en un DM de Instagram. Si tu app de correo no se abre, copia
                      el mensaje.
                    </>
                  )}
                </p>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap">
          <div>
            <p className="foot__name">
              <Rowel />
              Sara Valentina
            </p>
            <p style={{ marginTop: 12 }}>Bogotá, Colombia · Boyacá &amp; Llanos Orientales · Media kit 2026</p>
          </div>
          <nav aria-label="Redes">
            <a href={INSTAGRAM} target="_blank" rel="noopener">
              Instagram
            </a>
            <a href={TIKTOK} target="_blank" rel="noopener">
              TikTok
            </a>
            <a href="/">Inicio</a>
            <a href="#contacto">Contacto</a>
          </nav>
        </div>
      </footer>

      <div className={`dock${dockAway ? " is-away" : ""}`}>
        <a className="btn btn--cream" href="#contacto">
          Trabajemos juntas
        </a>
        <a className="mini" href={INSTAGRAM} target="_blank" rel="noopener" aria-label="Instagram de Sara Valentina">
          IG
        </a>
        <a className="mini" href={TIKTOK} target="_blank" rel="noopener" aria-label="TikTok de Sara Valentina">
          TT
        </a>
      </div>

      {hoverFino && (
        <div
          className={`peek${peek?.on ? " on" : ""}`}
          aria-hidden="true"
          style={
            peek
              ? {
                  transform: `translate3d(${Math.min(peek.x + 28, window.innerWidth - 200)}px,${peek.y - 120}px,0) rotate(-3deg)`,
                }
              : undefined
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {peek?.src && <img src={peek.src} alt="" />}
        </div>
      )}
    </>
  );
}

function Meters({ items }: { items: [string, string, number][] }) {
  return (
    <ul className="meters">
      {items.map(([label, val, v]) => (
        <li key={label}>
          <span className="m-label">{label}</span>
          <span className="m-val">{val}</span>
          <span className="bar" aria-hidden="true">
            <i style={{ "--v": v } as React.CSSProperties} />
          </span>
        </li>
      ))}
    </ul>
  );
}
