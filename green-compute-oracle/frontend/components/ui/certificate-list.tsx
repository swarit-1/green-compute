"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Award, ArrowRight, CheckCircle2, Clock } from "lucide-react";

interface Certificate {
    certificate_id: string;
    inference_id: string;
    timestamp: string;
    total_emissions_gco2: number;
    energy_used_kwh: number;
}

interface CertificateListProps {
    certificates: Certificate[];
    limit?: number;
}

export function CertificateList({ certificates, limit = 5 }: CertificateListProps) {
    const displayCerts = certificates.slice(0, limit);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card-hover p-6 rounded-2xl border border-dark-700"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold gradient-text mb-1">
                        Recent Certificates
                    </h2>
                    <p className="text-sm text-dark-400">
                        Latest verifiable green compute attestations
                    </p>
                </div>
                <Link
                    href="/certificates"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-800/60 hover:bg-emerald-500/10 
                     text-emerald-400 hover:text-emerald-300 font-semibold text-sm
                     border border-emerald-500/20 hover:border-emerald-500/40
                     transition-all duration-200 group"
                >
                    <span>View All</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* Certificate List */}
            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                {displayCerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Award className="w-12 h-12 text-dark-600 mb-3" />
                        <p className="text-dark-400 font-medium">No certificates yet</p>
                        <p className="text-sm text-dark-500 mt-1">
                            Certificates will appear here once generated
                        </p>
                    </div>
                ) : (
                    displayCerts.map((cert, index) => (
                        <motion.div
                            key={cert.certificate_id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="group relative p-4 rounded-xl bg-dark-900/40 border border-dark-700 
                         hover:border-emerald-500/40 hover:bg-dark-900/60
                         transition-all duration-200"
                        >
                            {/* Subtle glow effect on hover */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className="relative">
                                {/* Header Row */}
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Award className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                            <p className="text-xs font-mono text-dark-400 truncate">
                                                {cert.inference_id}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-dark-500">
                                            <Clock className="w-3 h-3" />
                                            <span>
                                                {new Date(cert.timestamp).toLocaleString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="verified-badge flex-shrink-0">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>Verified</span>
                                    </div>
                                </div>

                                {/* Stats Row */}
                                <div className="flex items-center gap-4 pt-3 border-t border-dark-800">
                                    <div className="flex-1">
                                        <p className="text-xs text-dark-500 mb-0.5">Emissions</p>
                                        <p className="text-lg font-bold text-emerald-400 tabular-nums">
                                            {cert.total_emissions_gco2.toFixed(2)}
                                            <span className="text-xs text-dark-400 ml-1 font-normal">gCO₂</span>
                                        </p>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-dark-500 mb-0.5">Energy</p>
                                        <p className="text-lg font-bold text-blue-400 tabular-nums">
                                            {cert.energy_used_kwh.toFixed(4)}
                                            <span className="text-xs text-dark-400 ml-1 font-normal">kWh</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
}
