"use client"

import Hero from "./_components/Hero"

export default function HomePageContent() {
  return (
    <div className="min-h-screen bg-[#F5F0E1] dark:bg-[#0A1F35] text-[#003A5F] dark:text-[#F5F0E1] font-body">
      <div className="relative">
        <Hero />

        <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-[#003A5F]/15 dark:border-[#F5F0E1]/10 bg-[#003A5F] dark:bg-[#0A1628]">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-sm text-[#F5F0E1]/85">
              &copy; {new Date().getFullYear()}{" "}
              <span className="text-[#F5F0E1]">Yingqiang Yuan</span>
              <span className="mx-2 text-[#D03027]">·</span>
              <span className="font-serif italic">MIT licensed</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
