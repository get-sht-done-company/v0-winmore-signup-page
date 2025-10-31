"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { PhoneInput } from "@/components/phone-input"
import confetti from "canvas-confetti"

const signupSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .refine((val) => val.trim().split(/\s+/).length >= 2, "Please enter your full name (first and last name)"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine((val) => {
      // Remove spaces and common formatting
      const cleaned = val.replace(/\s+/g, "")
      // UK mobile numbers: 07xxx xxxxxx (10 digits starting with 07)
      // UK landline: 01xxx or 02xxx (10-11 digits)
      // Accept with or without leading 0
      const ukPhoneRegex = /^(0?[1-9]\d{8,9})$/
      return ukPhoneRegex.test(cleaned)
    }, "Please enter a valid UK phone number"),
  termsAccepted: z.boolean().refine((val) => val === true, "You must accept the terms and conditions"),
  // Honeypot field for spam prevention
  company: z.string().max(0).optional(),
})

type SignupFormData = z.infer<typeof signupSchema>

export default function JoinClientPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showIcons, setShowIcons] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onSubmit",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      termsAccepted: false,
      company: "",
    },
  })

  const phoneValue = watch("phone")
  const termsAccepted = watch("termsAccepted")

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const capitalized = value
      .split(" ")
      .map((word) => {
        if (word.length === 0) return word
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      })
      .join(" ")
    setValue("fullName", capitalized)
  }

  const onSubmit = async (data: SignupFormData) => {
    if (data.company) {
      console.log("[Spam detected] Honeypot field was filled")
      return
    }

    setIsSubmitting(true)

    try {
      const formattedPhone = data.phone.replace(/\s+/g, "").replace(/^0/, "+44")

      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: data.fullName.trim().replace(/\s+/g, " "),
          email: data.email,
          phone: formattedPhone,
        }),
      })

      if (!response.ok) {
        throw new Error("Signup failed")
      }

      window.location.href = "https://winmore.uk/prizes"
    } catch (error) {
      console.error("Signup error:", error)
      alert("Something went wrong. Please try again or contact support if the problem persists.")
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    setShowIcons(true)
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#F34D4E", "#FF6B6B", "#E63946", "#ffffff"],
    })
  }, [])

  return (
    <>
      <style jsx global>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px #18181b inset !important;
          -webkit-text-fill-color: #f4f4f5 !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.25; }
        }

        @keyframes twinkle-slow {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.3; }
        }

        @keyframes twinkle-fast {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.35; }
        }

        @keyframes spring-pop {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          60% {
            transform: scale(1.1);
          }
          80% {
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .icon-animate-1 {
          animation: spring-pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          animation-delay: 0.2s;
          opacity: 0;
        }

        .icon-animate-2 {
          animation: spring-pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          animation-delay: 0.4s;
          opacity: 0;
        }

        .icon-animate-3 {
          animation: spring-pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          animation-delay: 0.6s;
          opacity: 0;
        }

        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          pointer-events: none;
        }

        .star-layer-1 .star {
          animation: twinkle 3s ease-in-out infinite;
        }

        .star-layer-2 .star {
          animation: twinkle-slow 4s ease-in-out infinite;
        }

        .star-layer-3 .star {
          animation: twinkle-fast 2s ease-in-out infinite;
        }
      `}</style>

      <div className="h-screen md:min-h-screen w-full flex justify-center md:p-4 bg-[#030303] relative overflow-hidden items-start md:items-center">
        <div
          className="hidden md:block absolute inset-0 pointer-events-none z-[1]"
          style={{
            background: `radial-gradient(ellipse 120% 60% at 50% 100%, #FF8FAB 0%, #D81B60 25%, #6A0F49 50%, #030303 70%)`,
          }}
        />

        <div className="hidden md:block absolute inset-0 pointer-events-none star-layer-1 z-[2]">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={`star-1-${i}`}
              className="star"
              style={{
                width: "2px",
                height: "2px",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 40}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: 0.05,
              }}
            />
          ))}
        </div>

        <div className="hidden md:block absolute inset-0 pointer-events-none star-layer-2 z-[2]">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={`star-2-${i}`}
              className="star"
              style={{
                width: "3px",
                height: "3px",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 35}%`,
                animationDelay: `${Math.random() * 4}s`,
                opacity: 0.08,
              }}
            />
          ))}
        </div>

        <div className="hidden md:block absolute inset-0 pointer-events-none star-layer-3 z-[2]">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`star-3-${i}`}
              className="star"
              style={{
                width: "4px",
                height: "4px",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 30}%`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: 0.1,
              }}
            />
          ))}
        </div>

        <nav className="md:hidden fixed top-0 left-0 right-0 h-[52px] backdrop-blur-sm border-b border-zinc-800 z-50 flex items-center justify-between mx-0 px-6 bg-zinc-950">
          <a href="https://winmore.uk" className="block">
            <img src="/images/design-mode/winmore_logo_min(1).svg" alt="Winmore" className="w-auto h-7" />
          </a>
          <a
            href="https://winmore.uk"
            className="w-8 h-8 flex items-center justify-center hover:text-white transition-colors text-zinc-700"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </a>
        </nav>

        <div className="hidden md:block w-full max-w-[872px] relative z-10 mt-16">
          <div className="flex overflow-hidden shadow-2xl border border-zinc-900 rounded-2xl">
            <div className="w-1/2 backdrop-blur-xl bg-zinc-950 p-[52px] pt-12">
              <div className="flex justify-center mb-6">
                <img src="/images/design-mode/winmore_logo_min(1).svg" alt="Winmore" className="h-8 w-auto" />
              </div>

              <div className="text-center mb-8">
                <h1 className="font-semibold text-zinc-100 text-3xl tracking-[-0.025em] mb-2">Get started</h1>
                <p className="text-zinc-400 text-sm">
                  Join thousands of UK players and get double credit to spin, play and win.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
                <div className="space-y-3 mb-0">
                  <div>
                    <label htmlFor="fullName" className="sr-only">
                      Full name
                    </label>
                    <div className="relative">
                      <input
                        id="fullName"
                        type="text"
                        autoComplete="name"
                        placeholder="Full name"
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 bg-zinc-900 border text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-white/30 focus:shadow-[0_0_0_1px_rgba(255,255,255,1),0_0_0_3px_rgba(255,255,255,0.25)] transition-all disabled:opacity-50 disabled:cursor-not-allowed border-zinc-800 rounded-lg"
                        {...register("fullName")}
                        onChange={handleNameChange}
                        aria-invalid={errors.fullName ? "true" : "false"}
                        aria-describedby={errors.fullName ? "fullName-error" : undefined}
                      />
                    </div>
                    {errors.fullName && (
                      <p id="fullName-error" className="mt-1.5 text-sm text-red-400">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="sr-only">
                      Email address
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="Email address"
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 pr-11 bg-zinc-900 border text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-white/30 focus:shadow-[0_0_0_1px_rgba(255,255,255,1),0_0_0_3px_rgba(255,255,255,0.25)] transition-all disabled:opacity-50 disabled:cursor-not-allowed border-zinc-800 rounded-lg"
                        {...register("email")}
                        aria-invalid={errors.email ? "true" : "false"}
                        aria-describedby={errors.email ? "email-error" : undefined}
                      />
                      <svg
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-input-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    {errors.email && (
                      <p id="email-error" className="mt-1.5 text-sm text-red-400">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="sr-only">
                      Phone number
                    </label>
                    <PhoneInput
                      value={phoneValue}
                      onChange={(value) => setValue("phone", value)}
                      disabled={isSubmitting}
                      aria-invalid={errors.phone ? "true" : "false"}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                    />
                    {errors.phone && (
                      <p id="phone-error" className="mt-1.5 text-sm text-red-400">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <input
                  type="text"
                  {...register("company")}
                  className="absolute opacity-0 pointer-events-none"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div className="flex items-start gap-3">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      id="terms-desktop"
                      type="checkbox"
                      {...register("termsAccepted")}
                      disabled={isSubmitting}
                      className="w-5 h-5 bg-zinc-900 border border-zinc-800 rounded appearance-none cursor-pointer checked:bg-[#F34D4E] checked:border-[#F34D4E] focus:outline-none focus:border-white/30 focus:shadow-[0_0_0_1px_rgba(255,255,255,1),0_0_0_3px_rgba(255,255,255,0.25)] transition-all disabled:opacity-50 disabled:cursor-not-allowed peer"
                      aria-invalid={errors.termsAccepted ? "true" : "false"}
                      aria-describedby={errors.termsAccepted ? "terms-error" : undefined}
                    />
                    <svg
                      className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="terms-desktop"
                      className="text-xs text-zinc-500 leading-relaxed cursor-pointer max-w-[80%] block"
                    >
                      By creating an account, you agree to our{" "}
                      <a
                        href="https://winmore.uk/terms-and-conditions"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white underline underline-offset-2 transition-colors text-zinc-400"
                      >
                        Terms & Conditions
                      </a>{" "}
                      and{" "}
                      <a
                        href="https://winmore.uk/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white underline underline-offset-2 transition-colors text-zinc-400"
                      >
                        Privacy Policy
                      </a>
                      .
                    </label>
                    {errors.termsAccepted && (
                      <p id="terms-error" className="mt-1.5 text-sm text-red-400">
                        {errors.termsAccepted.message}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !termsAccepted}
                  className="mt-6 w-full py-3 px-4 bg-[#F34D4E] text-white font-semibold hover:bg-[#FF6B6B] active:bg-[#E63946] focus:outline-none focus:ring-2 focus:ring-[#F34D4E] focus:ring-offset-2 focus:ring-offset-zinc-950 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 tracking-[-0.025em] rounded-lg shadow-none"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin size-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    "Claim double credit"
                  )}
                </button>
              </form>
            </div>

            <div
              className="w-1/2 bg-[#6F47CB] bg-cover bg-center relative"
              style={{
                backgroundImage:
                  "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/real-OMjh5Is5QN7LmcEwP4nauW4iZdFMzo.webp)",
              }}
            >
              <img
                src="/images/design-mode/excellent.webp"
                alt="Trustpilot Excellent Rating"
                className="absolute bottom-6 right-6 w-20 h-auto"
              />
            </div>
          </div>
        </div>

        <div className="md:hidden w-full h-full flex flex-col relative z-10">
          <div
            className="h-[38vh] bg-cover bg-center relative"
            style={{
              backgroundImage:
                "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mobi-Cmrhcst4tJfzDX2s77eHMGXRqowvWv.webp)",
            }}
          >
            <nav className="absolute top-0 left-0 right-0 h-[52px] bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800 z-50 flex items-center justify-between px-3.5">
              <a href="https://winmore.uk" className="block">
                <img
                  src="/images/design-mode/winmore_logo_min(1).svg"
                  alt="Winmore"
                  className="w-auto h-7 transition-transform duration-500 hover:rotate-360 cursor-pointer"
                />
              </a>
              <a
                href="https://winmore.uk"
                className="w-8 h-8 flex items-center justify-center hover:text-white transition-colors text-zinc-700"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </a>
            </nav>
          </div>

          <div className="flex-1 px-[14px] pb-[80px] rounded-t-3xl -mt-9 relative z-20 flex flex-col justify-between bg-zinc-950 pl-7 pr-7 pt-7">
            <div className="max-w-md mx-auto">
              <h1 className="font-semibold text-zinc-100 tracking-[-0.025em] mb-2 text-2xl">Get started</h1>
              <div className="flex items-center mb-6 gap-2 mr-1">
                <p className="text-zinc-400 text-sm flex-1 min-w-0">
                  Join thousands of UK players and get double credit to spin, play and win.
                </p>
                <div className="flex items-center -space-x-2 flex-shrink-0">
                  <img
                    src="/images/design-mode/peoples_1.webp"
                    alt="Player"
                    className={`w-7 h-7 rounded-full border-2 border-zinc-950 object-cover ${showIcons ? "icon-animate-1" : ""}`}
                  />
                  <img
                    src="/images/design-mode/peoples_2.webp"
                    alt="Player"
                    className={`w-7 h-7 rounded-full border-2 border-zinc-950 object-cover ${showIcons ? "icon-animate-2" : ""}`}
                  />
                  <img
                    src="/images/design-mode/peoples_3.webp"
                    alt="Player"
                    className={`w-7 h-7 rounded-full border-2 border-zinc-950 object-cover ${showIcons ? "icon-animate-3" : ""}`}
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-0 space-y-3">
                  <div>
                    <label htmlFor="fullName-mobile" className="sr-only">
                      Full name
                    </label>
                    <div className="relative">
                      <input
                        id="fullName-mobile"
                        type="text"
                        autoComplete="name"
                        placeholder="Full name"
                        disabled={isSubmitting}
                        autoFocus
                        className="w-full px-4 py-3 bg-zinc-900 border text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-white/30 focus:shadow-[0_0_0_1px_rgba(255,255,255,1),0_0_0_3px_rgba(255,255,255,0.25)] transition-all disabled:opacity-50 disabled:cursor-not-allowed border-zinc-800 rounded-lg"
                        {...register("fullName")}
                        onChange={handleNameChange}
                        aria-invalid={errors.fullName ? "true" : "false"}
                        aria-describedby={errors.fullName ? "fullName-error-mobile" : undefined}
                      />
                    </div>
                    {errors.fullName && (
                      <p id="fullName-error-mobile" className="mt-1.5 text-sm text-red-400">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email-mobile" className="sr-only">
                      Email address
                    </label>
                    <div className="relative">
                      <input
                        id="email-mobile"
                        type="email"
                        autoComplete="email"
                        placeholder="Email address"
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 pr-11 bg-zinc-900 border text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-white/30 focus:shadow-[0_0_0_1px_rgba(255,255,255,1),0_0_0_3px_rgba(255,255,255,0.25)] transition-all disabled:opacity-50 disabled:cursor-not-allowed border-zinc-800 rounded-lg h-12"
                        {...register("email")}
                        aria-invalid={errors.email ? "true" : "false"}
                        aria-describedby={errors.email ? "email-error-mobile" : undefined}
                      />
                      <svg
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-input-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    {errors.email && (
                      <p id="email-error-mobile" className="mt-1.5 text-sm text-red-400">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone-mobile" className="sr-only">
                      Phone number
                    </label>
                    <PhoneInput
                      value={phoneValue}
                      onChange={(value) => setValue("phone", value)}
                      disabled={isSubmitting}
                      aria-invalid={errors.phone ? "true" : "false"}
                      aria-describedby={errors.phone ? "phone-error-mobile" : undefined}
                    />
                    {errors.phone && (
                      <p id="phone-error-mobile" className="mt-1.5 text-sm text-red-400">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <input
                  type="text"
                  {...register("company")}
                  className="absolute opacity-0 pointer-events-none"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div className="flex items-start gap-3 mt-5">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      id="terms-mobile"
                      type="checkbox"
                      {...register("termsAccepted")}
                      disabled={isSubmitting}
                      className="w-5 h-5 bg-zinc-900 border border-zinc-800 rounded appearance-none cursor-pointer checked:bg-[#F34D4E] checked:border-[#F34D4E] focus:outline-none focus:border-white/30 focus:shadow-[0_0_0_1px_rgba(255,255,255,1),0_0_0_3px_rgba(255,255,255,0.25)] transition-all disabled:opacity-50 disabled:cursor-not-allowed peer"
                      aria-invalid={errors.termsAccepted ? "true" : "false"}
                      aria-describedby={errors.termsAccepted ? "terms-error-mobile" : undefined}
                    />
                    <svg
                      className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="terms-mobile"
                      className="text-xs text-zinc-500 leading-relaxed cursor-pointer max-w-[80%] block"
                    >
                      By creating an account, you agree to our{" "}
                      <a
                        href="https://winmore.uk/terms-and-conditions"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white underline underline-offset-2 transition-colors text-zinc-400"
                      >
                        Terms & Conditions
                      </a>{" "}
                      and{" "}
                      <a
                        href="https://winmore.uk/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white underline underline-offset-2 transition-colors text-zinc-400"
                      >
                        Privacy Policy
                      </a>
                      .
                    </label>
                    {errors.termsAccepted && (
                      <p id="terms-error-mobile" className="mt-1.5 text-sm text-red-400">
                        {errors.termsAccepted.message}
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950 z-30 py-2 opacity-100 px-7">
            <button
              type="submit"
              disabled={isSubmitting || !termsAccepted}
              onClick={handleSubmit(onSubmit)}
              className="w-full py-3 px-4 bg-[#F34D4E] text-white font-semibold hover:bg-[#FF6B6B] active:bg-[#E63946] focus:outline-none focus:ring-2 focus:ring-[#F34D4E] focus:ring-offset-2 focus:ring-offset-zinc-950 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 tracking-[-0.025em] rounded-lg shadow-none"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating account...
                </>
              ) : (
                "Claim double credit"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
