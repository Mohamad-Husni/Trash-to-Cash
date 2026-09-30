"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/store/auth-store";
import { User, Truck, ShieldCheck, ArrowRight, Sparkles, MapPin, Coins, Settings } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import type { Role } from "@/types";

export default function LoginPage() {
  const loginAs = useAuthStore((s) => s.loginAs);
  const router = useRouter();

  const handleLogin = (role: Role) => {
    loginAs(role);
    if (role === "citizen") router.push("/citizen/dashboard");
    else if (role === "collector") router.push("/collector/dashboard");
    else if (role === "admin") router.push("/admin/dashboard");
  };

  const roles = [
    {
      role: "citizen" as Role,
      icon: User,
      title: "Citizen",
      subtitle: "Household User",
      desc: "Book recyclable pickups, track status, and earn reward points redeemable for vouchers.",
      features: [
        { icon: MapPin, text: "Book pickups from your bins" },
        { icon: Coins, text: "Earn points & redeem vouchers" },
      ],
      color: "from-[#0066C5] to-[#0099FF]",
      glow: "shadow-[0_0_20px_rgba(0,153,255,0.25)]",
      delay: 0,
    },
    {
      role: "collector" as Role,
      icon: Truck,
      title: "Collector",
      subtitle: "Approved Driver",
      desc: "View nearby collection jobs on a live map, claim pickups, and verify waste at the field.",
      features: [
        { icon: MapPin, text: "5km radius job map" },
        { icon: ShieldCheck, text: "Verify & complete pickups" },
      ],
      color: "from-[#003B73] to-[#0055A4]",
      glow: "shadow-[0_0_20px_rgba(0,85,164,0.2)]",
      delay: 0.08,
    },
    {
      role: "admin" as Role,
      icon: Settings,
      title: "Admin",
      subtitle: "CEO / System Owner",
      desc: "Full platform oversight — monitor bins live, approve collectors, configure point engine & vouchers.",
      features: [
        { icon: MapPin, text: "Live bin telemetry map" },
        { icon: Settings, text: "Point engine & voucher config" },
      ],
      color: "from-[#0B1D3A] to-[#002855]",
      glow: "shadow-[0_0_20px_rgba(11,29,58,0.2)]",
      delay: 0.16,
    },
  ];

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-navy-gradient p-3 sm:p-4">
      {/* Animated background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#0099FF]/15 blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#0055A4]/15 blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-1/2 top-1/3 h-64 w-64 rounded-full bg-[#0066C5]/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Logo & title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex flex-col items-center gap-3"
      >
        <BrandLogo className="float h-24 w-24 rounded-2xl shadow-2xl sm:h-28 sm:w-28" />
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Bincoin
          </h1>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-sm font-medium text-[#0099FF]">
            <Sparkles className="h-3.5 w-3.5" />
            Smart Waste Management System
          </p>
        </div>
      </motion.div>

      {/* Role cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="grid w-full gap-3 sm:gap-4 sm:grid-cols-2"
      >
        {roles.map((r) => {
          const Icon = r.icon;
          return (
            <motion.button
              key={`${r.title}-${r.subtitle}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 + r.delay }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLogin(r.role)}
              className={`group relative flex flex-col items-start gap-3 overflow-hidden rounded-2xl border border-[#0099FF]/15 bg-card/80 p-4 sm:p-5 text-left shadow-lg backdrop-blur-md transition-all hover:border-[#0099FF]/40 hover:shadow-xl ${r.glow}`}
            >
              {/* Header row */}
              <div className="flex w-full items-center gap-3">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${r.color} shadow-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-foreground">{r.title}</span>
                  <span className="text-xs font-medium text-[#0099FF]">{r.subtitle}</span>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground/40 transition-all group-hover:translate-x-1 group-hover:text-[#0099FF]" />
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed text-muted-foreground">
                {r.desc}
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2">
                {r.features.map((f, i) => {
                  const FIcon = f.icon;
                  return (
                    <span
                      key={i}
                      className="flex items-center gap-1.5 rounded-full border border-[#0099FF]/15 bg-[#0099FF]/8 px-2.5 py-1 text-xs text-foreground/80"
                    >
                      <FIcon className="h-3 w-3 text-[#0099FF]" />
                      {f.text}
                    </span>
                  );
                })}
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 text-center text-xs text-muted-foreground"
      >
        Front-end demo • All data is mock and stored locally • Switch roles anytime from the top menu
      </motion.p>
    </div>
  );
}
