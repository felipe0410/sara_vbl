# Sara Valentina · sitio web

Landing y media kit de Sara Valentina, creadora de contenido (beauty, fashion, lifestyle y western chic).
El diseño viene de Claude Design ("Media kit y landing page") y está pasado a Next.js como sitio estático.

| Ruta          | Qué es                                                                 |
|---------------|------------------------------------------------------------------------|
| `/`           | Landing: hero en tríptico, sobre mí, cuatro mundos, cifras, marcas, contacto |
| `/media-kit/` | Media kit 2026: comunidad, portafolio con filtros, western, colaboraciones y formulario que arma la propuesta |

## Correr y publicar

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # deja el sitio estático en out/
npm run deploy   # build + firebase deploy --only hosting (proyecto sara-balaguera)
```

## Dónde se cambia cada cosa

- **Correo y redes:** `src/lib/contacto.ts`
- **Cifras, videos, marcas y servicios:** listas al inicio de `src/app/page.tsx` y `src/app/media-kit/MediaKit.tsx`
- **Fotos:** `public/img/` (mismo nombre de archivo = se reemplaza sin tocar código)
- **Colores, tipografías, botones, barra y pie:** `src/app/globals.css` (tokens en `:root`, con modo oscuro)
- **Estilos propios:** `src/app/landing.css` (prefijo `lp-`) y `src/app/media-kit/media-kit.css`
