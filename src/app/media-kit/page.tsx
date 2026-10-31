import type { Metadata } from "next";
import MediaKit from "./MediaKit";
import "./media-kit.css";

export const metadata: Metadata = {
  title: "Sara Valentina · Media kit",
  description:
    "Media kit 2026 de Sara Valentina: comunidad, audiencia, portafolio de video, western chic y formatos para colaborar con marcas.",
};

export default function Page() {
  return <MediaKit />;
}
