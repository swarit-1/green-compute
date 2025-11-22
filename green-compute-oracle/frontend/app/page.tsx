"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { StatCard } from "@/components/ui/cards";
import { EmissionsChart } from "@/components/ui/emissions-chart";
import { CertificateList } from "@/components/ui/certificate-list";
import { ParticleBackground } from "@/components/ui/particle-background";
import { Zap, TrendingDown, Battery, Award } from "lucide-react";
import { motion } from "framer-motion";

const API_BASE = "http://localhost:8001/api/v1";

interface Certificate {
    certificate_id: string;
    inference_id: string;
    timestamp: string;
    total_emissions_gco2: number;
    energy_used_kwh: number;
}

interface Stats {
    totalEmissions: number;
    avgEmissions: number;
    totalEnergy: number;
    certCount: number;
}

export default function Dashboard() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<Stats>({
        totalEmissions: 0,
        avgEmissions: 0,
        totalEnergy: 0,
        certCount: 0,
    });

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(`${API_BASE}/certificates?limit=20`);
            if (response.ok) {
                const data: Certificate[] = await response.json();
                setCertificates(data);

                const totalEmissions = data.reduce(
                    (sum, c) => sum + c.total_emissions_gco2,
                    0
                );
                const totalEnergy = data.reduce(
                    (sum, c) => sum + c.energy_used_kwh,
                    0
                );

                setStats({
                    totalEmissions,
                    avgEmissions: data.length > 0 ? totalEmissions / data.length : 0,
                    totalEnergy,
                    certCount: data.length,
                });
            }
        } catch (error) {
            console.error("Failed to fetch:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-mesh relative">
            <ParticleBackground />

            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-3">
                        Carbon Intelligence Dashboard
                    </h1>
                    <p className="text-lg text-dark-300 max-w-2xl">
                        Real-time verifiable green compute metrics and cryptographic attestations
                        for sustainable AI inference.
                    </p>
                </motion.div>

                {loading ? (
                    // Loading State
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className="glass-card p-6 rounded-2xl h-36 shimmer"
                                />
                            ))}
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="glass-card p-6 rounded-2xl h-96 shimmer" />
                            <div className="glass-card p-6 rounded-2xl h-96 shimmer" />
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatCard
                                title="Total Emissions"
                                value={stats.totalEmissions.toFixed(2)}
                                unit="gCO₂"
                                icon={TrendingDown}
                                color="green"
                                delay={0}
                            />
                            <StatCard
                                title="Avg per Inference"
                                value={stats.avgEmissions.toFixed(2)}
                                unit="gCO₂"
                                icon={Zap}
                                color="blue"
                                delay={0.1}
                            />
                            <StatCard
                                title="Total Energy"
                                value={stats.totalEnergy.toFixed(4)}
                                unit="kWh"
                                icon={Battery}
                                color="purple"
                                delay={0.2}
                            />
                            <StatCard
                                title="Certificates"
                                value={stats.certCount}
                                unit="Verified"
                                icon={Award}
                                color="orange"
                                delay={0.3}
                            />
                        </div>

                        {/* Charts and Certificate List */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <EmissionsChart data={certificates} />
                            <CertificateList certificates={certificates} limit={5} />
                        </div>

                        {/* Additional Info Section */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                            <div className="glass-card p-6 rounded-2xl border border-dark-700">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                        <TrendingDown className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-dark-100 mb-1">
                                            Carbon Tracking
                                        </h3>
                                        <p className="text-sm text-dark-400">
                                            Monitor real-time CO₂ emissions from AI inference operations
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card p-6 rounded-2xl border border-dark-700">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                        <Award className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-dark-100 mb-1">
                                            Verifiable Credentials
                                        </h3>
                                        <p className="text-sm text-dark-400">
                                            Cryptographically signed W3C-compliant attestations
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card p-6 rounded-2xl border border-dark-700">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                        <Zap className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-dark-100 mb-1">
                                            Energy Metrics
                                        </h3>
                                        <p className="text-sm text-dark-400">
                                            GPU-level telemetry with precision energy measurements
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </div>

            {/* Footer */}
            <footer className="relative z-10 mt-20 border-t border-dark-800">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-dark-400">
                            © 2025 Green Compute Oracle. Powered by verifiable green energy intelligence.
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-sm text-dark-400">Live Tracking Active</span>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
