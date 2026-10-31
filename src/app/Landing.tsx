"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import CopyMail from "@/components/CopyMail";
import { enlaces, pct, useContenido } from "@/lib/contenido";

const Star = ({ size }: { size?: "sm" | "md" | "lg" }) => (
  <span className={`lp-star${size ? ` lp-star--${size}` : ""}`} aria-hidden="true" />
);

const MUNDOS: { id: "beauty" | "fashion" | "lifestyle" | "western"; k: string; nombre: string; texto: string; img: string; pos: string; alt: string }[] = [
  {
    k: "01 · Tutoriales y reseñas",
    id: "beauty",
    nombre: "Beauty",
    texto: "Maquillaje, skincare y rutinas reales.",
    img: "/img/beauty.jpg",
    pos: "50% 25%",
    alt: "Sara Valentina con abrigo de piel negro junto a un perro",
  },
  {
    k: "02 · Editorial y styling",
    id: "fashion",
    nombre: "Fashion",
    texto: "Outfits, unboxing y estilismo.",
    img: "/img/fashion.jpg",
    pos: "50% 35%",
    alt: "Sara Valentina con vestido negro entre borlas rojas",
  },
  {
    k: "03 · GRWM y vlogs",
    id: "lifestyle",
    nombre: "Lifestyle",
    texto: "Lugares, viajes y día a día.",
    img: "/img/lifestyle.jpg",
    pos: "50% 20%",
    alt: "Sara Valentina con blazer de pata de gallo caminando en un jardín",
  },
  {
    k: "04 · Campo y tradición",
    id: "western",
    nombre: "Western chic",
    texto: "Boyacá, los Llanos y la vida de campo.",
    img: "/img/western-caballo.jpg",
    pos: "45% 40%",
    alt: "Sara Valentina montando a caballo en un desfile",
  },
];

export default function Landing() {
  const c = useContenido();
  const L = enlaces(c);
  const { email: EMAIL, instagram: INSTAGRAM, tiktok: TIKTOK } = L;
  const CIFRAS = [
    [c.tiktok.seguidores, "seguidores en TikTok"],
    [c.tiktok.vistas365, "visualizaciones en TikTok · 365 días"],
    [c.instagram.seguidores, "seguidores en Instagram"],
    [pct(c.instagram.colombia), "de mi audiencia de Instagram está en Colombia"],
  ];
  return (
    <>
      <header className="topbar">
        <div className="wrap">
          <a className="brand" href="#inicio">
            <Star />
            Sara Valentina
          </a>
          <nav className="nav" aria-label="Secciones">
            <a href="#sobre-mi">Sobre mí</a>
            <a href="#contenido">Contenido</a>
            <Link href="/media-kit/">Media kit</Link>
          </nav>
          <a className="btn btn--cream" href="#contacto">
            Contacto
          </a>
        </div>
      </header>

      <main>
        <section id="inicio" className="lp-hero">
          <div className="wrap lp-hero__in">
            <p className="lp-kicker">
              <span>Creadora de contenido</span>
              <Star size="md" />
              <span>Bogotá, Colombia</span>
            </p>
            <h1 className="lp-mast">
              <span>Sara</span>
              <em>Valentina</em>
            </h1>
            <p className="lp-tags">
              <span>Beauty</span>
              <Star size="sm" />
              <span>Fashion</span>
              <Star size="sm" />
              <span>Lifestyle</span>
              <Star size="sm" />
              <span>Western chic</span>
            </p>
            <p className="lp-lede">
              Moda, belleza y lifestyle con estética editorial, en una mirada que viaja de la ciudad al campo colombiano.
            </p>
            <div className="lp-ctas">
              <a className="btn btn--cream" href="#contacto">
                Trabajemos juntas
              </a>
              <Link className="btn btn--line" href="/media-kit/">
                Ver media kit
              </Link>
            </div>

            <div className="lp-triptych">
              <div className="lp-arch">
                <div className="lp-arch__img">
                  <img
                    src="/img/western-retrato.jpg"
                    width={677}
                    height={1105}
                    alt="Sara Valentina con sombrero vaquero claro y pañoleta naranja"
                    style={{ objectPosition: "50% 30%" }}
                  />
                </div>
              </div>
              <div className="lp-arch lp-arch--mid">
                <div className="lp-arch__img">
                  <img
                    src="/img/cover.jpg"
                    width={1100}
                    height={1555}
                    alt="Sara Valentina de noche con gabardina beige y guantes largos de cuero"
                    style={{ objectPosition: "50% 16%" }}
                    fetchPriority="high"
                  />
                </div>
              </div>
              <div className="lp-arch">
                <div className="lp-arch__img">
                  <img
                    src="/img/fashion.jpg"
                    width={410}
                    height={670}
                    alt="Sara Valentina con vestido negro entre borlas rojas"
                    style={{ objectPosition: "50% 30%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="sobre-mi" className="lp-sec">
          <div className="wrap lp-about">
            <figure className="lp-about__fig">
              <div className="lp-about__img">
                <img
                  src="/img/about.jpg"
                  width={610}
                  height={1235}
                  loading="lazy"
                  alt="Sara Valentina sentada, con vestido rosa palo, gafas doradas y botas de cuero vinotinto"
                />
              </div>
              <figcaption>Bogotá · Boyacá · Llanos</figcaption>
            </figure>
            <div className="lp-about__text">
              <p className="eyebrow">
                <Star />
                Hola
              </p>
              <h2 className="h2 lp-h2">
                Soy <em>Sara Valentina</em>
              </h2>
              <p>
                Creadora de contenido colombiana. Transformo experiencias cotidianas en historias visuales, recomendaciones
                cercanas y contenido con identidad.
              </p>
              <p>
                Mi sello combina feminidad, estética editorial, espontaneidad frente a la cámara y una conexión especial con el
                universo western chic.
              </p>
              <blockquote className="lp-pull">Creo contenido para inspirar, conectar y contar historias.</blockquote>
            </div>
          </div>
        </section>

        <section id="contenido" className="lp-sec lp-content">
          <div className="wrap">
            <div className="lp-content__head">
              <div>
                <p className="eyebrow">
                  <Star />
                  Mi contenido
                </p>
                <h2 className="h2 lp-h2">
                  Cuatro mundos, <em>una misma mirada</em>
                </h2>
              </div>
              <a className="btn btn--ghost" href={TIKTOK} target="_blank" rel="noopener">
                Ver todo en TikTok ↗
              </a>
            </div>

            <div className="lp-worlds">
              {MUNDOS.map((m) => (
                <a key={m.nombre} className="lp-world" href={c.mundos[m.id]} target="_blank" rel="noopener">
                  <div className="lp-world__img">
                    <img src={m.img} alt={m.alt} loading="lazy" style={{ objectPosition: m.pos }} />
                  </div>
                  <div className="lp-world__cap">
                    <span className="lp-world__k">{m.k}</span>
                    <h3>{m.nombre}</h3>
                    <p>{m.texto}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="lp-numbers" aria-label="Cifras">
          <div className="wrap">
            <ul>
              {CIFRAS.map(([n, t]) => (
                <li key={t}>
                  <b>{n}</b>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <Link className="lp-numbers__more" href="/media-kit/#comunidad">
              Ver audiencia completa en el media kit →
            </Link>
          </div>
        </section>

        <section className="lp-brands" aria-label="Marcas y formatos">
          <div className="wrap">
            <div className="lp-brands__col">
              <p className="label">Marcas presentes en mi contenido</p>
              <p className="lp-brands__list">
                {c.marcas.map((m, i) => (
                  <span key={i} style={{ display: "contents" }}>
                    {i > 0 && <Star size="md" />}
                    <span>{m}</span>
                  </span>
                ))}
              </p>
            </div>
            <div className="lp-brands__col">
              <p className="label">Formatos</p>
              <ul className="lp-pills">
                {c.formatos.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="contacto" className="lp-contact">
          <div className="lp-contact__grid">
            <div className="lp-contact__photo">
              <img
                src="/img/western-calle.jpg"
                loading="lazy"
                alt="Sara Valentina sonriendo con sombrero vaquero, con jinetes al fondo"
              />
            </div>
            <div className="lp-contact__body">
              <p className="eyebrow">
                <Star />
                Booking &amp; collaborations
              </p>
              <h2 className="lp-contact__title">
                Let’s create <em>something beautiful.</em>
              </h2>
              <ul className="lp-direct">
                <li>
                  <div className="lp-direct__mail">
                    <span className="lp-direct__k">Correo</span>
                    <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                  </div>
                  <CopyMail className="lp-copy" email={EMAIL} />
                </li>
                <li>
                  <span className="lp-direct__k">Instagram</span>
                  <a href={INSTAGRAM} target="_blank" rel="noopener">
                    {L.instagramHandle} ↗
                  </a>
                </li>
                <li>
                  <span className="lp-direct__k">TikTok</span>
                  <a href={TIKTOK} target="_blank" rel="noopener">
                    {L.tiktokHandle} ↗
                  </a>
                </li>
              </ul>
              <div className="lp-ctas">
                <a className="btn btn--cream" href={`mailto:${EMAIL}?subject=Colaboraci%C3%B3n`}>
                  Escríbeme
                </a>
                <Link className="btn btn--line" href="/media-kit/">
                  Ver media kit
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap">
          <div>
            <p className="foot__name">
              <Star size="lg" />
              Sara Valentina
            </p>
            <p style={{ marginTop: 10 }}>Bogotá, Colombia · Boyacá &amp; Llanos Orientales</p>
          </div>
          <nav aria-label="Redes">
            <a href={INSTAGRAM} target="_blank" rel="noopener">
              Instagram
            </a>
            <a href={TIKTOK} target="_blank" rel="noopener">
              TikTok
            </a>
            <Link href="/media-kit/">Media kit</Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
