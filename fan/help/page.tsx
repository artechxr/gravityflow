import { HelpCircle, Map, ShoppingBag, Coffee, Search, Award } from 'lucide-react';
import Link from 'next/link';

export default function FanHelpPage() {
    return (
        <div className="min-h-full w-full max-w-[390px] mx-auto flex flex-col p-6 bg-slate-900 pb-32 font-sans text-slate-200 shadow-2xl relative">
            <header className="mb-8 mt-4 flex items-center justify-between">
                <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
                    <HelpCircle className="w-8 h-8 text-blue-400" /> Guide
                </h1>
                <Link href="/fan/map" className="text-indigo-400 text-sm font-bold bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20 active:scale-95 transition-all">Back</Link>
            </header>

            <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
                <section className="bg-slate-800/50 p-5 rounded-3xl border border-white/5 backdrop-blur-md shadow-xl hover:-translate-y-1 transition-all">
                    <h2 className="text-lg font-bold text-white flex items-center gap-3 mb-3"><Map className="w-5 h-5 text-indigo-400" /> Live Map & Smart Routing</h2>
                    <p className="text-sm text-slate-400 leading-relaxed mb-4">
                        The Map shows real-time congestion scores of stadium zones. Red zones (over 70%) are high traffic—follow the green check-in zones for the fastest routes!
                    </p>
                </section>

                <section className="bg-slate-800/50 p-5 rounded-3xl border border-white/5 backdrop-blur-md shadow-xl hover:-translate-y-1 transition-all">
                    <h2 className="text-lg font-bold text-white flex items-center gap-3 mb-3"><Coffee className="w-5 h-5 text-rose-400" /> In-Seat Digital Ordering</h2>
                    <p className="text-sm text-slate-400 leading-relaxed mb-4">
                        Order food directly from the <strong>Menu</strong> tab or by tapping a concession stand on the map. Pay instantly and join the virtual "Ghost Queue" so you don't miss any of the game!
                    </p>
                    <div className="flex items-center gap-2 text-xs font-bold bg-amber-500/10 text-amber-500 p-2.5 rounded-xl border border-amber-500/20">
                        <ShoppingBag className="w-4 h-4 shrink-0" /> Pick up your order at the vendor when status turns 'Ready'.
                    </div>
                </section>

                <section className="bg-slate-800/50 p-5 rounded-3xl border border-white/5 backdrop-blur-md shadow-xl hover:-translate-y-1 transition-all">
                    <h2 className="text-lg font-bold text-white flex items-center gap-3 mb-3"><Award className="w-5 h-5 text-amber-400" /> Earning Fan Perks</h2>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        To help alleviate crowd density, you'll earn <strong>50 Fan Points</strong> every time you check into an active Green Zone! Redeem points later for merchandise or seat upgrades.
                    </p>
                </section>

                <section className="bg-slate-800/50 p-5 rounded-3xl border border-white/5 backdrop-blur-md shadow-xl hover:-translate-y-1 transition-all">
                    <h2 className="text-lg font-bold text-white flex items-center gap-3 mb-3"><Search className="w-5 h-5 text-purple-400" /> AI Lost & Found</h2>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Misplaced something? Snap a photo of a similar item or type its description in the Lost tab. Our AI instantly matches it against items turned into security.
                    </p>
                </section>
            </div>
        </div>
    );
}
