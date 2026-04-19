import Link from 'next/link';
import { Map, Coffee, ShoppingBag, Award, Search } from 'lucide-react';
import FanAssistanceOverlay from '@/components/FanAssistanceOverlay';
import EmergencyManager from '@/components/EmergencyManager';

export default function FanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-indigo-500/30">
      <EmergencyManager />
      <main className="flex-1 overflow-y-auto w-full max-w-[500px] mx-auto bg-slate-900 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative pb-[90px] scroll-smooth">
        <FanAssistanceOverlay />
        {children}
      </main>
      
      {/* Premium Apple-style floating bottom bar */}
      <nav className="fixed bottom-6 w-[92%] max-w-[460px] left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-2xl border border-white/10 h-[72px] flex items-center justify-between z-50 px-3 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
        <Link href="/fan/map" className="flex flex-col items-center flex-1 py-1 group transition-all">
          <Map className="w-6 h-6 text-slate-400 group-hover:text-indigo-400 group-active:scale-90 transition-all duration-300 mb-1" strokeWidth={2.5} />
          <span className="text-[9px] font-bold tracking-wider text-slate-500 group-hover:text-indigo-400 uppercase">Map</span>
        </Link>
        <Link href="/fan/menu" className="flex flex-col items-center flex-1 py-1 group transition-all">
          <Coffee className="w-6 h-6 text-slate-400 group-hover:text-rose-400 group-active:scale-90 transition-all duration-300 mb-1" strokeWidth={2.5} />
          <span className="text-[9px] font-bold tracking-wider text-slate-500 group-hover:text-rose-400 uppercase">Menu</span>
        </Link>
        <Link href="/fan/order" className="flex flex-col items-center flex-1 py-1 group transition-all">
          <ShoppingBag className="w-6 h-6 text-slate-400 group-hover:text-teal-400 group-active:scale-90 transition-all duration-300 mb-1" strokeWidth={2.5} />
          <span className="text-[9px] font-bold tracking-wider text-slate-500 group-hover:text-teal-400 uppercase">Cart</span>
        </Link>
        <Link href="/fan/rewards" className="flex flex-col items-center flex-1 py-1 group transition-all">
          <Award className="w-6 h-6 text-slate-400 group-hover:text-amber-400 group-active:scale-90 transition-all duration-300 mb-1" strokeWidth={2.5} />
          <span className="text-[9px] font-bold tracking-wider text-slate-500 group-hover:text-amber-400 uppercase">Perks</span>
        </Link>
        <Link href="/fan/lost" className="flex flex-col items-center flex-1 py-1 group transition-all">
          <Search className="w-6 h-6 text-slate-400 group-hover:text-purple-400 group-active:scale-90 transition-all duration-300 mb-1" strokeWidth={2.5} />
          <span className="text-[9px] font-bold tracking-wider text-slate-500 group-hover:text-purple-400 uppercase">Lost</span>
        </Link>
      </nav>
    </div>
  );
}
