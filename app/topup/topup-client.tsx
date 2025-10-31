"use client"

import { useState } from "react"

const PRESET_AMOUNTS = [5, 10, 15, 20]
const BONUS_PERCENTAGE = 59

export default function TopUpClientPage() {
  const [selectedAmount, setSelectedAmount] = useState(5)
  const [isProcessing, setIsProcessing] = useState(false)

  const bonusAmount = (selectedAmount * BONUS_PERCENTAGE) / 100
  const totalAmount = selectedAmount + bonusAmount

  const handleTopUp = async () => {
    setIsProcessing(true)

    try {
      // TODO: Implement actual payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log(`Processing top-up of £${selectedAmount} with ${BONUS_PERCENTAGE}% bonus`)

      // Redirect or show success message
      alert(`Successfully topped up £${totalAmount.toFixed(2)}!`)
    } catch (error) {
      console.error("Top-up error:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#030303] relative overflow-hidden">
      {/* Mobile header */}
      <nav className="fixed top-0 left-0 right-0 h-[52px] backdrop-blur-sm border-b border-zinc-800 z-50 flex items-center justify-between px-6 bg-zinc-950">
        <div className="w-8" /> {/* Spacer for centering */}
        <h2 className="text-zinc-100 font-semibold text-base">Top Up</h2>
        <a
          href="/"
          className="w-8 h-8 flex items-center justify-center hover:text-white transition-colors text-zinc-400"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </a>
      </nav>

      {/* Main content */}
      <div className="pt-[52px] px-6 pb-24">
        <div className="max-w-md mx-auto pt-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-zinc-100 font-semibold text-3xl tracking-[-0.025em] mb-3">Top Up Account</h1>
            <p className="text-zinc-400 text-base leading-relaxed">
              Choose an amount and add funds instantly to start playing your favorite games
            </p>
          </div>

          {/* Amount selection */}
          <div className="mb-6">
            <h2 className="text-zinc-100 font-semibold text-xl mb-4">Select Amount</h2>
            <div className="grid grid-cols-4 gap-3 mb-6">
              {PRESET_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setSelectedAmount(amount)}
                  className={`py-4 px-4 rounded-2xl font-semibold text-lg transition-all ${
                    selectedAmount === amount
                      ? "bg-transparent border-2 border-[#F34D4E] text-zinc-100"
                      : "bg-zinc-900 border-2 border-transparent text-zinc-100 hover:border-zinc-700"
                  }`}
                >
                  £{amount}
                </button>
              ))}
            </div>

            {/* Selected amount display */}
            <div className="bg-zinc-900 rounded-2xl p-6 mb-4">
              <div className="text-zinc-100 font-semibold text-4xl">£ {selectedAmount}</div>
            </div>

            {/* Bonus indicator */}
            <div className="bg-emerald-950/50 border border-emerald-900/50 rounded-2xl p-4">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-semibold text-lg">+{BONUS_PERCENTAGE}%</span>
                <span className="text-emerald-400/80 text-base">bonus applied</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 z-30 py-4 px-6">
        <button
          onClick={handleTopUp}
          disabled={isProcessing}
          className="w-full py-4 px-4 bg-[#F34D4E] text-white font-semibold text-lg hover:bg-[#FF6B6B] active:bg-[#E63946] focus:outline-none focus:ring-2 focus:ring-[#F34D4E] focus:ring-offset-2 focus:ring-offset-zinc-950 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 tracking-[-0.025em] rounded-2xl"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </>
          ) : (
            `Top Up £${totalAmount.toFixed(0)}`
          )}
        </button>
      </div>
    </div>
  )
}
