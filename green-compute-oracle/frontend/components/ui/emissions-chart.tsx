"use client";

import { motion } from "framer-motion";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts";

interface EmissionsChartProps {
    data: Array<{
        timestamp: string;
        total_emissions_gco2: number;
    }>;
}

export function EmissionsChart({ data }: EmissionsChartProps) {
    // Prepare data for chart
    const chartData = data
        .slice(0, 12)
        .reverse()
        .map((item) => ({
            time: new Date(item.timestamp).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
            }),
            emissions: parseFloat(item.total_emissions_gco2.toFixed(2)),
        }));

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-card-hover p-6 rounded-2xl border border-dark-700"
        >
            <div className="mb-6">
                <h2 className="text-2xl font-bold gradient-text mb-1">
                    Emissions Over Time
                </h2>
                <p className="text-sm text-dark-400">
                    Real-time carbon footprint tracking
                </p>
            </div>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255, 255, 255, 0.05)"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="time"
                            stroke="#64748b"
                            style={{
                                fontSize: "12px",
                                fontWeight: 500,
                            }}
                            tickLine={false}
                            axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
                        />

                        <YAxis
                            stroke="#64748b"
                            style={{
                                fontSize: "12px",
                                fontWeight: 500,
                            }}
                            tickLine={false}
                            axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
                            tickFormatter={(value) => `${value}`}
                        />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(15, 23, 42, 0.95)",
                                border: "1px solid rgba(16, 185, 129, 0.3)",
                                borderRadius: "12px",
                                padding: "12px 16px",
                                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
                                backdropFilter: "blur(10px)",
                            }}
                            labelStyle={{
                                color: "#10b981",
                                fontWeight: 600,
                                marginBottom: "4px",
                            }}
                            itemStyle={{
                                color: "#cbd5e1",
                                fontSize: "14px",
                                fontWeight: 500,
                            }}
                            formatter={(value: any) => [`${value} gCO₂`, "Emissions"]}
                        />

                        <Area
                            type="monotone"
                            dataKey="emissions"
                            stroke="#10b981"
                            strokeWidth={3}
                            fill="url(#colorEmissions)"
                            dot={{
                                fill: "#10b981",
                                stroke: "#fff",
                                strokeWidth: 2,
                                r: 4,
                            }}
                            activeDot={{
                                r: 6,
                                fill: "#10b981",
                                stroke: "#fff",
                                strokeWidth: 2,
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
