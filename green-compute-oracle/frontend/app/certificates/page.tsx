"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { ParticleBackground } from "@/components/ui/particle-background";
import { motion, AnimatePresence } from "framer-motion";
import {
    Award,
    Search,
    Download,
    RefreshCw,
    CheckCircle2,
    Clock,
    Zap,
    TrendingDown,
} from "lucide-react";

const API_BASE = "http://localhost:8001/api/v1";

interface Certificate {
    certificate_id: string;
    inference_id: string;
    timestamp: string;
    energy_used_kwh: number;
    carbon_intensity_gco2_kwh: number;
    total_emissions_gco2: number;
    signature: string;
}

export default function CertificatesPage() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchId, setSearchId] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/certificates?limit=50`);
            if (response.ok) {
                const data = await response.json();
                setCertificates(data);
            }
        } catch (error) {
            console.error("Failed to fetch certificates:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchId) return;
        setIsSearching(true);
        try {
            const response = await fetch(`${API_BASE}/certificate/${searchId}`);
            if (response.ok) {
                const cert = await response.json();
                setCertificates([cert]);
            }
        } catch (error) {
            console.error("Failed to search certificate:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleExport = () => {
        window.open(`${API_BASE}/compliance/export`, "_blank");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <main className="min-h-screen bg-gradient-mesh relative">
            <ParticleBackground />
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-3">
                        Green Compute Certificates
                    </h1>
                    <p className="text-lg text-dark-300 max-w-2xl">
                        Cryptographically verified carbon footprint attestations for all AI inference operations
                    </p>
                </motion.div>

                {/* Search and Actions Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="glass-card-hover p-6 rounded-2xl border border-dark-700 mb-8"
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 flex gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                <input
                                    type="text"
                                    placeholder="Search by Inference ID..."
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="w-full pl-12 pr-4 py-3 bg-dark-900/60 border border-dark-700 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 
                             text-dark-100 placeholder-dark-500 transition-all"
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                disabled={isSearching || !searchId}
                                className="btn-premium disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center gap-2 px-6"
                            >
                                {isSearching ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Search className="w-4 h-4" />
                                )}
                                Search
                            </button>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleExport}
                                className="px-5 py-3 rounded-xl font-semibold
                           bg-blue-500/10 hover:bg-blue-500/20 
                           text-blue-400 hover:text-blue-300
                           border border-blue-500/30 hover:border-blue-500/50
                           transition-all duration-200
                           flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Export CSV
                            </button>
                            <button
                                onClick={fetchCertificates}
                                className="px-5 py-3 rounded-xl font-semibold
                           bg-dark-800/60 hover:bg-dark-700/60 
                           text-dark-300 hover:text-dark-100
                           border border-dark-700 hover:border-dark-600
                           transition-all duration-200
                           flex items-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Refresh
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="glass-card p-6 rounded-2xl h-64 shimmer" />
                        ))}
                    </div>
                )}

                {/* Certificates Grid */}
                <AnimatePresence mode="wait">
                    {!loading && certificates.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {certificates.map((cert, index) => (
                                <motion.div
                                    key={cert.certificate_id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="group glass-card-hover p-6 rounded-2xl border border-dark-700 relative overflow-hidden"
                                >
                                    {/* Hover Glow */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 
                                  group-hover:from-emerald-500/5 group-hover:via-emerald-500/10 group-hover:to-emerald-500/5 
                                  transition-all duration-500 rounded-2xl" />

                                    <div className="relative z-10">
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="verified-badge">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                <span>Verified</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-dark-500">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>
                                                    {new Date(cert.timestamp).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Inference ID */}
                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Award className="w-4 h-4 text-emerald-500" />
                                                <span className="text-xs font-semibold text-dark-400 uppercase tracking-wide">
                                                    Inference ID
                                                </span>
                                            </div>
                                            <p className="text-sm font-mono text-emerald-400 truncate">
                                                {cert.inference_id}
                                            </p>
                                        </div>

                                        {/* Metrics */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center justify-between p-3 bg-dark-900/40 rounded-xl border border-dark-800">
                                                <div className="flex items-center gap-2">
                                                    <Zap className="w-4 h-4 text-blue-400" />
                                                    <span className="text-sm text-dark-400">Energy</span>
                                                </div>
                                                <span className="text-sm font-bold text-blue-400 tabular-nums">
                                                    {cert.energy_used_kwh.toFixed(4)} kWh
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between p-3 bg-dark-900/40 rounded-xl border border-dark-800">
                                                <div className="flex items-center gap-2">
                                                    <TrendingDown className="w-4 h-4 text-purple-400" />
                                                    <span className="text-sm text-dark-400">Intensity</span>
                                                </div>
                                                <span className="text-sm font-bold text-purple-400 tabular-nums">
                                                    {cert.carbon_intensity_gco2_kwh.toFixed(1)} gCO₂/kWh
                                                </span>
                                            </div>
                                        </div>

                                        {/* Total Emissions - Highlighted */}
                                        <div className="p-4 bg-gradient-to-r from-emerald-900/30 to-emerald-800/30 rounded-xl 
                                    border border-emerald-500/30 shadow-glow">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold text-dark-300">Total Emissions</span>
                                                <span className="text-xl font-bold text-emerald-400 tabular-nums">
                                                    {cert.total_emissions_gco2.toFixed(2)}
                                                    <span className="text-sm text-dark-400 ml-1">gCO₂</span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Certificate ID */}
                                        <div className="mt-4 pt-4 border-t border-dark-800">
                                            <p className="text-xs text-dark-500 font-mono truncate">
                                                {cert.certificate_id}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Empty State */}
                    {!loading && certificates.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card p-12 rounded-2xl border border-dark-700 text-center"
                        >
                            <Award className="w-16 h-16 text-dark-700 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-dark-300 mb-2">
                                No certificates found
                            </h3>
                            <p className="text-dark-500">
                                {searchId
                                    ? "Try a different search term"
                                    : "Run the telemetry agent to generate certificates"}
                            </p>
                            {searchId && (
                                <button
                                    onClick={() => {
                                        setSearchId("");
                                        fetchCertificates();
                                    }}
                                    className="mt-6 btn-premium"
                                >
                                    Clear Search
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer */}
            <footer className="relative z-10 mt-20 border-t border-dark-800">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-dark-400">
                            All certificates are cryptographically signed and verifiable
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-sm text-dark-400">
                                {certificates.length} Certificates
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
