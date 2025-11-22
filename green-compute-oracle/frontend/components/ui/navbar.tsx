"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Leaf, LayoutDashboard, Award } from "lucide-react";

const navItems = [
    {
        name: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        name: "Certificates",
        href: "/certificates",
        icon: Award,
    },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="glass-card sticky top-0 z-50 border-b border-emerald-500/20">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/20 rounded-xl blur-xl group-hover:bg-emerald-500/30 transition-all" />
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                                className="relative p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl"
                            >
                                <Leaf className="w-6 h-6 text-white" strokeWidth={2.5} />
                            </motion.div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold gradient-text">
                                Green Compute Oracle
                            </h1>
                            <p className="text-xs text-dark-400 font-medium">
                                Verifiable Carbon Intelligence
                            </p>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center gap-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link key={item.href} href={item.href} className="relative">
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`
                      flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold
                      transition-all duration-200 relative overflow-hidden
                      ${isActive
                                                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-glow"
                                                : "text-dark-300 hover:text-emerald-400 hover:bg-dark-800/60"
                                            }
                    `}
                                    >
                                        <Icon className="w-4 h-4" strokeWidth={2.5} />
                                        <span className="text-sm">{item.name}</span>

                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600 -z-10 rounded-xl"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}
