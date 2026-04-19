"use client";

import { useEffect, useState } from 'react';
import { Activity, ArrowUpRight, ArrowDownRight, Clock, Users, Zap, ShieldCheck, PlayCircle } from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsDashboard() {
    const [analytics, setAnalytics] = useState<any>(null);
    const [insights, setInsights] = useState<string[]>([]);

    useEffect(() => {
        const fetchIntel = async () => {
            const res = await fetch('/api/intelligence');
            if (res.ok) {
                const data = await res.json();
                setAnalytics(data.analytics);
                setInsights(data.globalInsights);
            }
        };
        fetchIntel();
        const int = setInterval(fetchIntel, 10000);
        return () => clearInterval(int);
    }, []);

    if (!analytics) return <div className="min-h-screen bg-slate-950 flex items-center justify-center animate-pulse text-indigo-400">Syncing Intelligence...</div>;

    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-12 text-slate-200">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400 mb-2 mt-4 tracking-tighter">
                        Performance Analytics
                    </h1>
                    <p className="text-slate-400 font-medium">Predictive Routing & Crowd Engine Metrics</p>
                </div>
                <Link href="/" className="px-6 py-2.5 rounded-full bg-slate-900 border border-slate-700 hover:bg-slate-800 transition-colors text-sm font-bold tracking-wide">
                    Return to Hub
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {/* Metric 1 */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 hover:border-indigo-500/30 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <Clock className="w-8 h-8 text-indigo-400" />
                        <span className="flex items-center text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md text-xs font-bold">
                            <ArrowDownRight className="w-3 h-3 mr-1" />
                            {analytics.avgWaitReduction}% improved
                        </span>
                    </div>
                    <h3 className="text-slate-400 font-medium text-sm mb-1 uppercase tracking-wider">Avg Waiting Time</h3>
                    <p className="text-4xl font-black text-white">4.2<span className="text-xl text-slate-500 ml-1">min</span></p>
                </div>

                {/* Metric 2 */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 hover:border-fuchsia-500/30 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <Users className="w-8 h-8 text-fuchsia-400" />
                        <span className="flex items-center text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md text-xs font-bold">
                            <ArrowDownRight className="w-3 h-3 mr-1" />
                            {analytics.densityReduction}% reduced
                        </span>
                    </div>
                    <h3 className="text-slate-400 font-medium text-sm mb-1 uppercase tracking-wider">Crowd Density</h3>
                    <p className="text-4xl font-black text-white">68<span className="text-xl text-slate-500 ml-1">avg</span></p>
                </div>

                {/* Metric 3 */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 hover:border-rose-500/30 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <ShieldCheck className="w-8 h-8 text-rose-400" />
                        <span className="flex items-center text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md text-xs font-bold">
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                            Faster Deploy
                        </span>
                    </div>
                    <h3 className="text-slate-400 font-medium text-sm mb-1 uppercase tracking-wider">Dispatch Time</h3>
                    <p className="text-4xl font-black text-white">{analytics.dispatchResponseTime}</p>
                </div>

                {/* Metric 4 */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <Activity className="w-8 h-8 text-emerald-400" />
                        <span className="flex items-center text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md text-xs font-bold">
                            <Zap className="w-3 h-3 mr-1" />
                            Active
                        </span>
                    </div>
                    <h3 className="text-slate-400 font-medium text-sm mb-1 uppercase tracking-wider">Routing Efficiency</h3>
                    <p className="text-4xl font-black text-white">{analytics.optimizationEfficiency}<span className="text-xl text-slate-500 ml-1">%</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Timeline Replay */}
                <div className="bg-slate-900/80 border border-slate-700/50 rounded-[2rem] p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black text-white">Timeline Replay</h2>
                        <button className="flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                            <PlayCircle className="w-5 h-5" /> Start Playback
                        </button>
                    </div>
                    
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-indigo-500 text-slate-100 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow shadow-indigo-500/50">
                                <Zap className="w-4 h-4" />
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-800/80 p-4 border border-slate-700/50 rounded-2xl shadow-xl">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="font-bold text-indigo-300 text-sm">Now</div>
                                </div>
                                <div className="text-slate-400 font-medium text-[13px] leading-relaxed">
                                    System detected 14% drop in Zone C accumulation via preemptive smart routing overheads.
                                </div>
                            </div>
                        </div>

                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-rose-500 text-slate-100 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow shadow-rose-500/50">
                                <Activity className="w-4 h-4" />
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-800/80 p-4 border border-slate-700/50 rounded-2xl shadow-xl">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="font-bold text-rose-300 text-sm">-5 Mins</div>
                                </div>
                                <div className="text-slate-400 font-medium text-[13px] leading-relaxed">
                                    Stampede risk automatically flagged in Zone B. Dispatch algorithm deployed active stewards immediately.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Story-based Insights */}
                <div className="bg-slate-900/80 border border-slate-700/50 rounded-[2rem] p-8">
                    <h2 className="text-xl font-black text-white mb-6">Cognitive Insights</h2>
                    <div className="space-y-4">
                        {insights.map((insight, idx) => (
                            <div key={idx} className="bg-slate-800/50 border-l-4 border-l-indigo-500 p-5 rounded-r-2xl transform transition hover:-translate-y-1">
                                <p className="text-slate-300 font-medium leading-relaxed">{insight}</p>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-8 border-t border-slate-800 pt-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="font-bold text-emerald-400">System Autonomy Level</span>
                            <span className="font-black text-slate-300">92%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                            <div className="bg-emerald-500 h-2 rounded-full w-[92%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
