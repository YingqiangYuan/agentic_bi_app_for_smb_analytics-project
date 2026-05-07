"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, BarChart3, Shield, UserX, AlertTriangle, Users } from "lucide-react"
import { EXTERNAL_LINKS } from "@/lib/constants"

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const capabilities = [
    { icon: BarChart3, label: "Risk Pricing Alignment" },
    { icon: Shield, label: "Portfolio Concentration" },
    { icon: UserX, label: "Approval Leakage" },
    { icon: AlertTriangle, label: "Early Warning Signals" },
    { icon: Users, label: "Customer Lifecycle Value" },
  ]

  const sourceLinks = [
    {
      emoji: "🔍",
      title: "Schema Extractor",
      description: "How the agent learns the database structure",
      href: EXTERNAL_LINKS.SOURCE_DB_SCHEMA_EXTRACTOR,
      path: "smb_loan_ai/db_schema/extractor.py",
    },
    {
      emoji: "📜",
      title: "Agent System Prompt",
      description: "The instruction set that drives reasoning & tool use",
      href: EXTERNAL_LINKS.SOURCE_AGENT_SYSTEM_PROMPT,
      path: "smb_loan_ai/prompts/bi-agent-system-prompt.md",
    },
    {
      emoji: "🛠️",
      title: "Agent Definition & Tools",
      description: "@tool methods — run SQL, fetch schema, write debug reports",
      href: EXTERNAL_LINKS.SOURCE_AGENT_DEFINITION,
      path: "smb_loan_ai/one/one_04_agent.py",
    },
    {
      emoji: "🔌",
      title: "UI Backend",
      description: "FastAPI route streaming Bedrock responses to the chat UI",
      href: EXTERNAL_LINKS.SOURCE_UI_BACKEND,
      path: "api/index.py",
    },
  ]

  const techStack = [
    {
      name: "AWS Bedrock",
      href: "https://aws.amazon.com/bedrock/",
      className:
        "bg-[#FF9900]/12 text-[#B26500] dark:text-[#FFB84D] border-[#FF9900]/45 hover:bg-[#FF9900]/20",
    },
    {
      name: "Strands-Agents",
      href: "https://strandsagents.com/",
      className:
        "bg-emerald-600/10 text-emerald-800 dark:text-emerald-300 border-emerald-700/40 hover:bg-emerald-600/15",
    },
    {
      name: "Snowflake",
      href: "https://www.snowflake.com/",
      className:
        "bg-[#29B5E8]/12 text-[#147599] dark:text-[#29B5E8] border-[#29B5E8]/45 hover:bg-[#29B5E8]/20",
    },
    {
      name: "Next.js",
      href: "https://nextjs.org/",
      className:
        "bg-[#003A5F]/8 text-[#0A1F35] dark:bg-[#F5F0E1]/10 dark:text-[#F5F0E1] border-[#0A1F35]/35 dark:border-[#F5F0E1]/35 hover:bg-[#003A5F]/15 dark:hover:bg-[#F5F0E1]/20",
    },
    {
      name: "AI-SDK",
      href: "https://ai-sdk.dev/docs/introduction",
      className:
        "bg-violet-600/10 text-violet-800 dark:text-violet-300 border-violet-700/40 hover:bg-violet-600/15",
    },
  ]

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-paper-ledger overflow-hidden">
      {/* Guilloché flourish — decorative, anchored top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-32 sm:-right-20 w-[520px] h-[520px] opacity-[0.16] dark:opacity-[0.10]"
      >
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full text-[#003A5F] dark:text-[#F5F0E1]"
        >
          <g fill="none" stroke="currentColor" strokeWidth="0.55">
            <circle cx="200" cy="200" r="40" />
            <circle cx="200" cy="200" r="70" />
            <circle cx="200" cy="200" r="100" />
            <circle cx="200" cy="200" r="130" />
            <circle cx="200" cy="200" r="160" />
            <circle cx="200" cy="200" r="190" />
            {Array.from({ length: 18 }).map((_, i) => (
              <g key={i} transform={`rotate(${i * 10} 200 200)`}>
                <path d="M 30 200 Q 200 130, 370 200 Q 200 270, 30 200" />
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* Bottom-left flourish (smaller, mirrored) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-28 w-[360px] h-[360px] opacity-[0.10] dark:opacity-[0.07]"
      >
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full text-[#D03027]"
        >
          <g fill="none" stroke="currentColor" strokeWidth="0.5">
            <circle cx="200" cy="200" r="60" />
            <circle cx="200" cy="200" r="100" />
            <circle cx="200" cy="200" r="140" />
            <circle cx="200" cy="200" r="180" />
            {Array.from({ length: 14 }).map((_, i) => (
              <g key={i} transform={`rotate(${i * 12.857} 200 200)`}>
                <path d="M 60 200 Q 200 140, 340 200 Q 200 260, 60 200" />
              </g>
            ))}
          </g>
        </svg>
      </div>

      <div className="max-w-4xl mx-auto w-full relative">
        {/* Title */}
        <div
          className={`transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"}`}
        >
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.05] mb-4 tracking-tight">
            <span className="text-[#003A5F] dark:text-[#F5F0E1]">Lend</span>
            <span className="font-serif italic font-medium text-[#D03027] dark:text-[#E8564E]">
              Scope
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#7A6F5F] dark:text-[#B8A887] mb-4 max-w-2xl">
            Small Business Lending Analytics AI Agent for Business Intelligence
          </p>

          <div className="w-20 h-1.5 bg-[#D03027] rounded mb-10" />
        </div>

        {/* Description */}
        <div
          className={`transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p className="text-lg sm:text-xl text-[#1A1A1A]/85 dark:text-[#F5F0E1]/85 mb-10 leading-relaxed max-w-3xl">
            An AI agent that helps fintech lending teams analyze loan portfolios through
            natural conversation. Surface risk-pricing misalignment, measure portfolio
            concentration, spot approval leakage, detect early warning signals, and compare
            lifecycle value between repeat and first-time borrowers.
          </p>

          {/* Capability Cards — embossed paper feel */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
            {capabilities.map((cap, index) => (
              <div
                key={cap.label}
                className={`stamped relative p-5 rounded-lg bg-[#FAF6E9]/75 dark:bg-[#0F2741]/65 border border-[#003A5F]/15 dark:border-[#F5F0E1]/12 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: `${400 + index * 100}ms` }}
              >
                <cap.icon
                  className="w-6 h-6 text-[#D03027] dark:text-[#E8564E] mb-3"
                  strokeWidth={1.75}
                />
                <p className="text-sm font-medium text-[#003A5F] dark:text-[#F5F0E1]">
                  {cap.label}
                </p>
              </div>
            ))}
          </div>

          {/* Tech Stack Tags — stamped pills */}
          <div className="flex flex-wrap gap-2 mb-10">
            {techStack.map((tech) => (
              <a
                key={tech.name}
                href={tech.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`stamped px-4 py-1.5 text-sm rounded-full border transition-colors ${tech.className}`}
              >
                {tech.name}
              </a>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className={`transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <Link
            href="/chat"
            className="stamped group flex items-center justify-between w-full p-6 bg-[#FAF6E9]/85 dark:bg-[#0F2741]/75 border border-[#003A5F]/20 dark:border-[#F5F0E1]/15 rounded-2xl hover:border-[#D03027] dark:hover:border-[#E8564E] hover:shadow-[0_10px_30px_rgba(208,48,39,0.14)] transition-all duration-200 cursor-pointer"
          >
            <div>
              <h3 className="font-display text-2xl sm:text-3xl text-[#003A5F] dark:text-[#F5F0E1] mb-1">
                Start{" "}
                <span className="font-serif italic font-medium text-[#D03027] dark:text-[#E8564E]">
                  Analyzing
                </span>
              </h3>
              <p className="text-[#7A6F5F] dark:text-[#B8A887] text-sm sm:text-base">
                Ask questions about your lending portfolio in plain English
              </p>
            </div>
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#003A5F]/8 dark:bg-[#F5F0E1]/10 group-hover:bg-[#D03027] transition-colors">
              <ArrowRight className="w-6 h-6 text-[#003A5F]/70 dark:text-[#F5F0E1]/70 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        </div>

        {/* Under the Hood — portfolio code links */}
        <div
          className={`mt-16 transition-all duration-700 delay-[600ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="mb-6">
            <h3 className="font-display text-2xl sm:text-3xl tracking-tight mb-2">
              <span className="text-[#003A5F] dark:text-[#F5F0E1]">Under the </span>
              <span className="font-serif italic font-medium text-[#D03027] dark:text-[#E8564E]">
                Hood
              </span>
            </h3>
            <div className="w-12 h-1 bg-[#D03027] dark:bg-[#E8564E] rounded mb-3" />
            <p className="text-sm sm:text-base text-[#7A6F5F] dark:text-[#B8A887] max-w-2xl">
              Here&apos;s how the agent actually works under the hood.
              Each link points to the production source on GitHub.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {sourceLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`stamped group flex items-center gap-4 p-4 sm:p-5 bg-[#FAF6E9]/85 dark:bg-[#0F2741]/75 border border-[#003A5F]/15 dark:border-[#F5F0E1]/12 rounded-xl hover:border-[#D03027] dark:hover:border-[#E8564E] hover:shadow-[0_6px_20px_rgba(208,48,39,0.12)] transition-all duration-200 cursor-pointer ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: `${700 + index * 80}ms` }}
              >
                {/* Emoji badge */}
                <div className="stamped flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-lg bg-[#F5F0E1] dark:bg-[#0A1F35] border border-[#003A5F]/20 dark:border-[#F5F0E1]/15 text-2xl sm:text-3xl">
                  <span aria-hidden>{link.emoji}</span>
                </div>

                {/* Title + description + path */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-display text-base sm:text-lg font-semibold text-[#003A5F] dark:text-[#F5F0E1] leading-tight">
                    {link.title}
                  </h4>
                  <p className="text-sm text-[#7A6F5F] dark:text-[#B8A887] mt-0.5 leading-snug">
                    {link.description}
                  </p>
                  <p className="font-mono text-[11px] sm:text-xs text-[#7A6F5F]/75 dark:text-[#B8A887]/70 mt-1 truncate">
                    {link.path}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div className="flex items-center justify-center w-9 h-9 shrink-0 rounded-full bg-[#003A5F]/8 dark:bg-[#F5F0E1]/10 group-hover:bg-[#D03027] dark:group-hover:bg-[#E8564E] transition-colors">
                  <ArrowUpRight
                    className="w-4 h-4 text-[#003A5F]/70 dark:text-[#F5F0E1]/70 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                    strokeWidth={2}
                  />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Database Info / disclaimer */}
        <div
          className={`mt-10 transition-all duration-700 delay-[1100ms] ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
          <p className="text-sm text-[#7A6F5F] dark:text-[#B8A887]">
            Analyzing a synthesized SMB lending dataset modeled on a California fintech&apos;s
            ~2 years of operations: 10 tables, ~119K records spanning customers, applications,
            loans, repayment schedules, payments, and defaults.
          </p>
          <p className="mt-2 text-xs text-[#7A6F5F]/85 dark:text-[#B8A887]/85">
            A personal post-internship reflection — the schema and records are reconstructed from scratch to mirror realistic production patterns. No proprietary or production data is included.
          </p>
        </div>
      </div>
    </section>
  )
}
