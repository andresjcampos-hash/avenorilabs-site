import type { Metadata } from "next";
import BlogAdmin from "./BlogAdmin";

export const metadata: Metadata = {
  title: "Revisão editorial | Avenori",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <BlogAdmin />;
}