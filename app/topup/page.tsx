import type { Metadata } from "next"
import TopUpClientPage from "./topup-client"

export const metadata: Metadata = {
  title: "Top Up Account - Winmore",
  description: "Choose an amount and add funds instantly to start playing your favorite games",
}

export default function TopUpPage() {
  return <TopUpClientPage />
}
