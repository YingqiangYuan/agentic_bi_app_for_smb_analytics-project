"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Github } from "lucide-react"
import { NavItem, NavigationProps } from "@/types"
import { EXTERNAL_LINKS } from "@/lib/constants"

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Chat", href: "/chat" },
]

export default function Navigation({ items = DEFAULT_NAV_ITEMS }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F5F0E1]/95 dark:bg-[#0A1F35]/95 backdrop-blur-sm border-b border-[#003A5F]/15 dark:border-[#F5F0E1]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand — ledger style */}
          <Link
            href="/"
            className="flex items-center gap-3 text-[#003A5F] dark:text-[#F5F0E1] hover:opacity-90 transition-opacity"
          >
            <span className="font-display text-xl tracking-tight">
              Lend
              <span className="font-serif italic font-medium text-[#D03027] dark:text-[#E8564E]">
                Scope
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {items.map((item) => {
              const active = isActive(item.href)
              const isChat = item.href === "/chat"

              if (isChat) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="stamped font-medium text-sm px-5 py-2 bg-[#D03027] dark:bg-[#E8564E] text-[#F5F0E1] rounded-lg hover:bg-[#A8261F] dark:hover:bg-[#D03027] transition-colors cursor-pointer"
                  >
                    Start Chat
                  </Link>
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    font-medium text-sm transition-colors cursor-pointer
                    ${active
                      ? "text-[#D03027] dark:text-[#E8564E]"
                      : "text-[#003A5F]/80 dark:text-[#F5F0E1]/80 hover:text-[#003A5F] dark:hover:text-[#F5F0E1]"
                    }
                  `}
                >
                  {item.label}
                </Link>
              )
            })}

            {/* GitHub Repo */}
            <a
              href={EXTERNAL_LINKS.GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#003A5F]/80 dark:text-[#F5F0E1]/80 hover:text-[#003A5F] dark:hover:text-[#F5F0E1] transition-colors cursor-pointer"
              aria-label="View source on GitHub"
            >
              <Github size={20} strokeWidth={1.75} />
            </a>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-[#003A5F]/80 dark:text-[#F5F0E1]/80 hover:text-[#003A5F] dark:hover:text-[#F5F0E1] transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[#003A5F]/15 dark:border-[#F5F0E1]/10">
            <div className="py-4 space-y-2">
              {items.map((item) => {
                const active = isActive(item.href)
                const isChat = item.href === "/chat"

                if (isChat) {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="stamped block font-medium text-base py-3 px-4 bg-[#D03027] dark:bg-[#E8564E] text-[#F5F0E1] text-center rounded-lg mx-4 cursor-pointer"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Start Chat
                    </Link>
                  )
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      block font-medium text-base py-3 px-4 transition-colors cursor-pointer
                      ${active
                        ? "text-[#D03027] dark:text-[#E8564E]"
                        : "text-[#003A5F]/80 dark:text-[#F5F0E1]/80 hover:text-[#003A5F] dark:hover:text-[#F5F0E1]"
                      }
                    `}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              })}

              {/* GitHub Repo */}
              <a
                href={EXTERNAL_LINKS.GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-medium text-base py-3 px-4 text-[#003A5F]/80 dark:text-[#F5F0E1]/80 hover:text-[#003A5F] dark:hover:text-[#F5F0E1] transition-colors cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
                aria-label="View source on GitHub"
              >
                <Github size={20} strokeWidth={1.75} />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
