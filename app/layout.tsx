import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "test1",
  description: "this is test to see if Netty's got it",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
