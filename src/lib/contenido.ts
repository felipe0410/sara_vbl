"use client";

// Todo lo que Sara puede cambiar desde /admin. Vive en Firestore (sitio/contenido).
// El sitio sale con DEFAULTS en el HTML y, al cargar, toma lo último guardado.

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore/lite";
import { db } from "./firebase";

export type Cat = "beauty" | "fashion" | "lifestyle";
export type Video = { cat: Cat; tipo: string; titulo: string; url: string };
export type WesternLink = { k: string; t: string; viral: boolean; url: string };

export type Contenido = {
  contacto: { email: string; instagram: string; tiktok: string };
  tiktok: {
    seguidores: string;
    vistas365: string;
    espectadores365: string;
    mujeres: string;
    colombia: string;
    edad2534: string;
  };
  instagram: { seguidores: string; vistas30: string; vistas90: string; colombia: string; edad2534: string };
  anio: string;
  nota: string;
  videos: Video[];
  western: WesternLink[];
  mundos: { beauty: string; fashion: string; lifestyle: string; western: string };
  marcas: string[];
  formatos: string[];
};

export const DEFAULTS: Contenido = {
  contacto: { email: "svalentinee.contacto@gmail.com", instagram: "svalentinee", tiktok: "svalentinee" },
  tiktok: {
    seguidores: "18,1K",
    vistas365: "927,7K",
    espectadores365: "753,3K",
    mujeres: "74",
    colombia: "57,8",
    edad2534: "52,3",
  },
  instagram: { seguidores: "5.612", vistas30: "44.574", vistas90: "104.872", colombia: "79,3", edad2534: "34,8" },
  anio: "2026",
  nota: "Métricas tomadas de las estadísticas de cada plataforma, 2026.",
  videos: [
    { cat: "beauty", tipo: "Beauty · Tutorial", titulo: "Tutorial de maquillaje", url: "https://vt.tiktok.com/ZSgm7SX9H/" },
    { cat: "beauty", tipo: "Beauty · Reseña", titulo: "Reseña de belleza", url: "https://vt.tiktok.com/ZSgm7joy8/" },
    { cat: "beauty", tipo: "Beauty · Skincare", titulo: "Reseña de skincare", url: "https://vt.tiktok.com/ZSgm7y2RG/" },
    { cat: "fashion", tipo: "Fashion · Unboxing", titulo: "Unboxing de moda", url: "https://vt.tiktok.com/ZSgm7Nv6F/" },
    { cat: "fashion", tipo: "Fashion · Editorial", titulo: "Fashion editorial", url: "https://vt.tiktok.com/ZSgm75avT/" },
    { cat: "lifestyle", tipo: "Lifestyle · GRWM", titulo: "Get ready with me", url: "https://vt.tiktok.com/ZSgm7fQLH/" },
  ],
  western: [
    { k: "Storytime", t: "Historia", viral: true, url: "https://vt.tiktok.com/ZSgm7kqmu/" },
    { k: "Western chic", t: "Equitación", viral: false, url: "https://vt.tiktok.com/ZSgm7DEPR/" },
    { k: "Western life", t: "Vlog de campo", viral: false, url: "https://vt.tiktok.com/ZSgm72mUU/" },
    { k: "Vlog", t: "Vlog de viaje", viral: false, url: "https://vt.tiktok.com/ZSgm7htT3/" },
  ],
  mundos: {
    beauty: "https://vt.tiktok.com/ZSgm7SX9H/",
    fashion: "https://vt.tiktok.com/ZSgm75avT/",
    lifestyle: "https://vt.tiktok.com/ZSgm7fQLH/",
    western: "https://vt.tiktok.com/ZSgm7DEPR/",
  },
  marcas: ["Vichy", "Animus Lab", "La Roche-Posay", "Dermohelp", "Numbuzin"],
  formatos: [
    "TikTok patrocinado",
    "Instagram Reels",
    "Stories",
    "Video UGC",
    "Reseñas y unboxing",
    "GRWM y tutoriales",
    "Vlogs y viajes",
    "Eventos de marca",
  ],
};

export const DOC_PATH = ["sitio", "contenido"] as const;
const CACHE_KEY = "sv-contenido";
const CATS: Cat[] = ["beauty", "fashion", "lifestyle"];

const str = (v: unknown, d: string) => (typeof v === "string" ? v.trim() : d);
const obj = (v: unknown): Record<string, unknown> => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});
const strs = (v: unknown, d: string[]) =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.trim() !== "").map((x) => x.trim()) : d;

function campos<T extends Record<string, string>>(v: unknown, d: T): T {
  const o = obj(v);
  const r = { ...d };
  (Object.keys(d) as (keyof T)[]).forEach((k) => {
    r[k] = str(o[k as string], d[k]) as T[keyof T];
  });
  return r;
}

/** Junta lo guardado con los valores por defecto; descarta lo que no tenga la forma esperada. */
export function normalizar(raw: unknown): Contenido {
  const o = obj(raw);
  const d = DEFAULTS;
  const videos = Array.isArray(o.videos)
    ? o.videos
        .map(obj)
        .map((v) => ({
          cat: (CATS.includes(v.cat as Cat) ? v.cat : "beauty") as Cat,
          tipo: str(v.tipo, ""),
          titulo: str(v.titulo, ""),
          url: str(v.url, ""),
        }))
        .filter((v) => v.titulo && v.url)
    : d.videos;
  const western = Array.isArray(o.western)
    ? o.western
        .map(obj)
        .map((w) => ({ k: str(w.k, ""), t: str(w.t, ""), viral: w.viral === true, url: str(w.url, "") }))
        .filter((w) => w.t && w.url)
    : d.western;
  return {
    contacto: campos(o.contacto, d.contacto),
    tiktok: campos(o.tiktok, d.tiktok),
    instagram: campos(o.instagram, d.instagram),
    anio: str(o.anio, d.anio),
    nota: str(o.nota, d.nota),
    videos,
    western,
    mundos: campos(o.mundos, d.mundos),
    marcas: strs(o.marcas, d.marcas),
    formatos: strs(o.formatos, d.formatos),
  };
}

/** Enlaces que salen del usuario de Instagram/TikTok y del correo. */
export function enlaces(c: Contenido) {
  const ig = c.contacto.instagram.replace(/^@/, "");
  const tt = c.contacto.tiktok.replace(/^@/, "");
  return {
    email: c.contacto.email,
    instagram: `https://www.instagram.com/${ig}/`,
    instagramDM: `https://ig.me/m/${ig}`,
    instagramHandle: `@${ig}`,
    tiktok: `https://www.tiktok.com/@${tt}`,
    tiktokHandle: `@${tt}`,
  };
}

/** "57,8" → "57,8 %" para mostrar; y 57.8 para el ancho de la barra. */
export const pct = (v: string) => `${v} %`;
export const pctNum = (v: string) => Math.max(0, Math.min(100, parseFloat(v.replace(/\./g, "").replace(",", ".")) || 0));

export async function leerContenido(): Promise<Contenido> {
  const snap = await getDoc(doc(db(), ...DOC_PATH));
  return snap.exists() ? normalizar(snap.data()) : DEFAULTS;
}

export function useContenido(): Contenido {
  const [c, setC] = useState<Contenido>(DEFAULTS);
  useEffect(() => {
    let vivo = true;
    try {
      const cache = localStorage.getItem(CACHE_KEY);
      if (cache) setC(normalizar(JSON.parse(cache)));
    } catch {}
    leerContenido()
      .then((n) => {
        if (!vivo) return;
        setC(n);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(n));
        } catch {}
      })
      .catch(() => {});
    return () => {
      vivo = false;
    };
  }, []);
  return c;
}
