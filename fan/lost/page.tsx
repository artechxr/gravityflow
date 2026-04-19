"use client";

import { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Search, Crosshair, MapPin, ShieldCheck } from 'lucide-react';

type FoundItem = {
    id: string;
    keyword: string;
    description: string;
    location: string;
    status: string;
};

export default function FanLostPage() {
    const [keyword, setKeyword] = useState('');
    const [matches, setMatches] = useState<FoundItem[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isAnalyzed, setIsAnalyzed] = useState(false);
    const [detectedText, setDetectedText] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewImage(url);
            setIsAnalyzing(true);
            setIsAnalyzed(false);
            setKeyword('');
            setDetectedText('');
            
            // Simulate AI vision extracting keywords
            setTimeout(() => {
                const mockItems = [
                    { k: 'wallet', v: 'Black Leather Wallet' },
                    { k: 'keys', v: 'Set of Keys' },
                    { k: 'cap', v: 'Red Baseball Cap' }
                ];
                
                // Fallback to random if not recognized in filename
                let selected = mockItems[Math.floor(Math.random() * mockItems.length)];
                
                // Basic mock heuristic
                const fname = file.name.toLowerCase();
                if (fname.includes('key')) selected = mockItems[1];
                if (fname.includes('cap') || fname.includes('hat')) selected = mockItems[2];

                setKeyword(selected.k);
                setDetectedText(`${selected.v} (Simulated)`);
                setIsAnalyzing(false);
                setIsAnalyzed(true);
            }, 1800);
        }
    };

    const handleSearch = async () => {
        setIsSearching(true);
        setHasSearched(true);
        
        setTimeout(async () => {
            const res = await fetch('/data/found_items.json');
            const data: FoundItem[] = await res.json();
            
            const results = data.filter(item => 
                item.keyword.toLowerCase().includes(keyword.toLowerCase()) || 
                item.description.toLowerCase().includes(keyword.toLowerCase())
            );
            
            setMatches(results);
            setIsSearching(false);
        }, 1500);
    };

    const triggerFileInput = () => fileInputRef.current?.click();

    return (
        <div className="min-h-full w-full max-w-[390px] mx-auto flex flex-col p-6 bg-slate-900 pb-32">
            <header className="mb-8 mt-4">
                <h1 className="text-3xl font-black tracking-tight text-white mb-2 drop-shadow-md flex items-center gap-3">
                    <Search className="w-8 h-8 text-indigo-400" /> Lost & Found
                </h1>
                <p className="text-slate-400 text-sm font-medium">AI-powered item recovery and visual matching.</p>
            </header>

            <div className="bg-slate-800/60 rounded-3xl p-6 border border-white/5 mb-8 shadow-2xl backdrop-blur-xl transition-all">
                
                <div className="mb-6">
                    <label className="block text-slate-300 text-sm font-bold mb-3 uppercase tracking-wider">Visual Scan (AI)</label>
                    <div 
                        onClick={triggerFileInput}
                        className={`w-full h-40 border-2 border-dashed ${previewImage ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-600 bg-slate-950/50 hover:bg-slate-800/80 hover:border-slate-500'} rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group`}
                    >
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            ref={fileInputRef} 
                            onChange={handleImageUpload}
                        />
                        {previewImage ? (
                            <>
                                <img src={previewImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                                
                                {isAnalyzing && (
                                    <div className="relative z-10 flex flex-col items-center bg-black/60 px-4 py-3 rounded-xl backdrop-blur-md border border-indigo-500/30 shadow-xl w-3/4">
                                        <Crosshair className="w-6 h-6 text-indigo-400 mb-2 animate-[spin_3s_linear_infinite]" />
                                        <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em] animate-pulse">Running Vision AI</span>
                                    </div>
                                )}
                                
                                {isAnalyzed && (
                                    <div className="relative z-10 flex flex-col items-center bg-emerald-950/80 px-4 py-3 rounded-xl backdrop-blur-md border border-emerald-500/50 shadow-xl w-3/4 transform transition-all animate-in zoom-in duration-300">
                                        <ShieldCheck className="w-6 h-6 text-emerald-400 mb-1" />
                                        <span className="text-[9px] font-bold text-emerald-300 uppercase tracking-widest mb-1">Detected Object</span>
                                        <span className="text-sm font-black text-white">{detectedText}</span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center text-slate-500 group-hover:text-slate-300 transition-colors">
                                <Camera className="w-10 h-10 mb-3" />
                                <span className="text-sm font-bold">Tap to upload photo</span>
                                <span className="text-xs mt-1 opacity-70">JPEG, PNG supported</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-slate-300 text-sm font-bold mb-3 uppercase tracking-wider">Or describe item</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="e.g. Black leather wallet"
                            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600 shadow-inner"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    </div>
                </div>

                <button 
                    onClick={handleSearch}
                    disabled={(!keyword && !previewImage) || isSearching}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex justify-center items-center h-14"
                >
                    {isSearching ? (
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Scanning Database...</span>
                        </div>
                    ) : (
                        isAnalyzed ? 'Search for Match' : 'Run AI Search'
                    )}
                </button>
            </div>

            {hasSearched && !isSearching && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <h3 className="text-white font-bold mb-4 px-2 uppercase tracking-wide text-sm flex items-center gap-2">
                        <Crosshair className="w-4 h-4 text-emerald-400" /> Search Results
                    </h3>
                    {matches.length === 0 ? (
                        <div className="text-center p-8 bg-slate-800/40 rounded-3xl border border-white/5 backdrop-blur-md">
                            <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400 text-sm font-medium">No exact matches found yet. We'll automatically notify you if it turns up.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {matches.map(item => (
                                <div key={item.id} className="bg-slate-800/80 rounded-2xl p-5 border border-white/10 shadow-xl backdrop-blur-md hover:border-indigo-500/50 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="text-white text-lg font-bold capitalize select-all">{item.keyword}</h4>
                                        <span className="text-[10px] uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full font-bold shadow-sm">Match</span>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-4 leading-relaxed">{item.description}</p>
                                    <div className="flex items-center text-xs text-indigo-300 font-medium bg-indigo-950/40 px-3 py-2 rounded-lg border border-indigo-500/20">
                                        <MapPin className="w-4 h-4 mr-2 text-indigo-400" />
                                        Found near: {item.location.replace('_', ' ').toUpperCase()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
