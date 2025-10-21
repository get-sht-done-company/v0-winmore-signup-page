import type { Metadata } from "next"
import JoinClientPage from "./join-client"

export const metadata: Metadata = {
  title: "Get Started - Winmore | Double Spins, Real Wins",
  description:
    "Join thousands of UK players and get double credit to spin, play and win. Sign up now for double spins and real wins.",
  openGraph: {
    title: "Get Started - Winmore | Double Spins, Real Wins",
    description:
      "Join thousands of UK players and get double credit to spin, play and win. Sign up now for double spins and real wins.",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/social-navgeLneNT1EpmblYPwRlPB6gNCWsg.webp",
        width: 1200,
        height: 630,
        alt: "Winmore - Double Spins, Real Wins",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Get Started - Winmore | Double Spins, Real Wins",
    description:
      "Join thousands of UK players and get double credit to spin, play and win. Sign up now for double spins and real wins.",
    images: ["https://hebbkx1anhila5yf.public.blob.vercel-storage.com/social-navgeLneNT1EpmblYPwRlPB6gNCWsg.webp"],
  },
}

export default function JoinPage() {
  return <JoinClientPage />
}
