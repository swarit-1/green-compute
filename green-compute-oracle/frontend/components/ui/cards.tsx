"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface StatCardProps {
    title: string;
    value: string | number;
    unit?: string;
    icon?: LucideIcon;
    color?: "green" | "blue" | "purple" | "orange";
    trend?: {
        value: number;
        isPositive: boolean;
    };
    delay?: number;
}

const colorClasses = {
    green: {
        bg: "stat-card-green",
        text: "text-emerald-400",
        icon: "text-emerald-500",
        border: "border-emerald-500/30",
    },
    blue: {
        bg: "stat-card-blue",
        text: "text-blue-400",
        icon: "text-blue-500",
        border: "border-blue-500/30",
    },
    purple: {
        bg: "stat-card-purple",
        text: "text-purple-400",
        icon: "text-purple-500",
        border: "border-purple-500/30",
    },
    orange: {
        bg: "stat-card-orange",
        text: "text-orange-400",
        icon: "text-orange-500",
        border: "border-orange-500/30",
    },
};

export function StatCard({
    title,
    value,
    unit,
    icon: Icon,
    color = "green",
    trend,
    delay = 0,
}: StatCardProps) {
    const colors = colorClasses[color];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className={`stat-card ${colors.bg} border ${colors.border}`}
        >
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                    <p className="text-sm font-semibold text-dark-300 uppercase tracking-wide">
                        {title}
                    </p>
                    {Icon && (
                        <Icon className={`w-5 h-5 ${colors.icon}`} strokeWidth={2.5} />
                    )}
                </div>

                <div className="flex items-baseline gap-2 mb-1">
                    <p className={`text-4xl font-bold ${colors.text} tabular-nums`}>
                        {typeof value === "number" ? value.toLocaleString() : value}
                    </p>
                    {unit && (
                        <span className="text-sm font-medium text-dark-400">{unit}</span>
                    )}
                </div>

                {trend && (
                    <div className="flex items-center gap-1 mt-2">
                        <span
                            className={`text-xs font-semibold ${trend.isPositive ? "text-emerald-400" : "text-red-400"
                                }`}
                        >
                            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                        </span>
                        <span className="text-xs text-dark-400">vs last period</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
}

export function GlassCard({ children, className = "", hover = true }: GlassCardProps) {
    return (
        <div className={`${hover ? "glass-card-hover" : "glass-card"} ${className}`}>
            {children}
        </div>
    );
}
