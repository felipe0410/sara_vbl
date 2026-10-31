# Sara Valentina · sitio web

Landing y media kit de Sara Valentina, creadora de contenido (beauty, fashion, lifestyle y western chic).
El diseño viene de Claude Design ("Media kit y landing page") y está pasado a Next.js como sitio estático.

| Ruta          | Qué es                                                                 |
|---------------|------------------------------------------------------------------------|
| `/`           | Landing: hero en tríptico, sobre mí, cuatro mundos, cifras, marcas, contacto |
| `/media-kit/` | Media kit 2026: comunidad, portafolio con filtros, western, colaboraciones y formulario que arma la propuesta |
| `/admin/`     | Mini admin para cambiar contacto, cifras, videos, marcas y formatos sin tocar código |

## Admin

- Entra en `/admin/` con **saravbl93@gmail.com**. La primera vez (o si se olvida la clave) toca
  "Primera vez u olvidé mi contraseña" y llega un correo para crearla.
- Lo que se guarda va a Firestore (`sitio/contenido`). El sitio sale con los valores de
  `src/lib/contenido.ts` (`DEFAULTS`) y, al cargar, los reemplaza por lo guardado.
- Quién puede guardar lo deciden las reglas (`firestore.rules`), no la pantalla. Para sumar otra
  persona: agregar su correo en `firestore.rules` y en `ADMINS` de `src/app/admin/Admin.tsx`,
  crearle el usuario en Firebase Authentication y `firebase deploy --only firestore,hosting`.
- El registro público está cerrado: las cuentas se crean desde la consola de Firebase.
- Las fotos no se cambian desde el admin: se reemplazan en `public/img/` con el mismo nombre.

## Correr y publicar

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # deja el sitio estático en out/
npm run deploy   # build + firebase deploy --only hosting (proyecto sara-balaguera)
```

Probar el admin sin tocar producción (emuladores de Auth y Firestore, necesita Java):

```bash
npm run emuladores        # en una terminal
npm run dev:emuladores    # en otra; los usuarios se crean en el emulador por su API REST
```

## Dónde se cambia cada cosa

- **Correo, redes, cifras, videos, marcas y formatos:** desde `/admin/` (valores de respaldo en `src/lib/contenido.ts`)
- **Servicios y textos fijos:** `src/app/Landing.tsx` y `src/app/media-kit/MediaKit.tsx`
- **Fotos:** `public/img/` (mismo nombre de archivo = se reemplaza sin tocar código)
- **Colores, tipografías, botones, barra y pie:** `src/app/globals.css` (tokens en `:root`, con modo oscuro)
- **Estilos propios:** `src/app/landing.css` (prefijo `lp-`) y `src/app/media-kit/media-kit.css`
