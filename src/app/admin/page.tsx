import type { Metadata } from "next";
import Admin from "./Admin";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin · Sara Valentina",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Admin />;
}
