import { motion } from "framer-motion";
import { BarChart3, TrendingUp, UserX, AlertTriangle, Users } from "lucide-react";
import { METADATA } from "@/lib/constants";

export const Overview = () => {
  const quickInsights = [
    {
      icon: BarChart3,
      title: "Risk Pricing",
      description: "Compare implied vs actual default rates",
    },
    {
      icon: TrendingUp,
      title: "Portfolio Health",
      description: "Industry concentration & exposure",
    },
    {
      icon: UserX,
      title: "Approval Leakage",
      description: "Rejected profiles matching successful borrowers",
    },
    {
      icon: AlertTriangle,
      title: "Early Warnings",
      description: "Payment patterns before defaults",
    },
    {
      icon: Users,
      title: "Customer Value",
      description: "Repeat vs first-time borrowers",
    },
  ];

  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ delay: 0.3 }}
    >
      <div className="stamped border border-[#003A5F]/20 dark:border-[#F5F0E1]/12 bg-[#FAF6E9]/85 dark:bg-[#0F2741]/75 rounded-2xl">
        <div className="py-10 px-8">
          {/* Header — matches Hero's LendScope wordmark */}
          <div className="flex flex-col items-center text-center mb-8">
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight mb-3">
              <span className="text-[#003A5F] dark:text-[#F5F0E1]">Lend</span>
              <span className="font-serif italic font-medium text-[#D03027] dark:text-[#E8564E]">
                Scope
              </span>
            </h2>

            <div className="w-12 h-1 bg-[#D03027] dark:bg-[#E8564E] rounded mb-4" />

            <p className="text-[#7A6F5F] dark:text-[#B8A887] max-w-md">
              Ask questions about the SMB lending portfolio in plain English.
            </p>
          </div>

          {/* Quick Insight Cards — 5 cards: 2-up on mobile, 3-up on md+ */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {quickInsights.map((insight, index) => (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="stamped p-4 rounded-xl bg-[#F5F0E1]/60 dark:bg-[#0A1F35]/55 border border-[#003A5F]/15 dark:border-[#F5F0E1]/10"
              >
                <insight.icon
                  className="w-5 h-5 text-[#D03027] dark:text-[#E8564E] mb-2"
                  strokeWidth={1.75}
                />
                <h3 className="font-display font-medium text-sm text-[#003A5F] dark:text-[#F5F0E1]">{insight.title}</h3>
                <p className="text-xs text-[#7A6F5F] dark:text-[#B8A887] mt-0.5">{insight.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Example prompts */}
          <div className="mt-6 pt-6 border-t border-[#003A5F]/15 dark:border-[#F5F0E1]/10">
            <p className="text-xs font-serif italic text-[#7A6F5F]/85 dark:text-[#B8A887]/85 text-center">
              Try: &ldquo;What&apos;s the default rate by risk grade?&rdquo; or &ldquo;Which industries have the highest concentration?&rdquo;
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
