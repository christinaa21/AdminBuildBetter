import type { Metadata } from "next";
import { poppins } from "../../styles/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Admin BuildBetter",
  description: "Website Admin untuk Aplikasi Mobile BuildBetter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={poppins.variable}
      >
        {children}
      </body>
    </html>
  );
}
