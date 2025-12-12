import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Sparkles, AlertCircle, Truck, ArrowLeft, HelpCircle, Copy } from 'lucide-react';
import { TrackingData, TrackingStep } from '../types';
import { analyzeTrackingStatus } from '../services/geminiService';
import { fetchTrackingInfo } from '../services/trackingService';

export const Tracking: React.FC = () => {
  const navigate = useNavigate();
  const [trackingNum, setTrackingNum] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TrackingData | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async () => {
    if (!trackingNum.trim()) {
        setError("Please enter a valid tracking number.");
        return;
    }
    
    setError('');
    setLoading(true);
    setData(null);
    setAiSummary(null);

    try {
        // Call Real Service
        const trackingData = await fetchTrackingInfo(trackingNum.trim());

        if (trackingData) {
            setData(trackingData);
            setLoading(false);
            // Trigger AI analysis on real steps
            triggerAiAnalysis(trackingData.steps);
        } else {
            setLoading(false);
            setError("Tracking info not found. Please check your API configuration or the tracking number.");
        }
    } catch (err) {
        setLoading(false);
        setError("An unexpected error occurred. Please try again.");
    }
  };

  const triggerAiAnalysis = async (steps: TrackingStep[]) => {
    setAnalyzing(true);
    const summary = await analyzeTrackingStatus(steps);
    setAiSummary(summary);
    setAnalyzing(false);
  };

  const handleBack = () => {
    navigate('/', { state: { scrollTo: 'tools-section' } });
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-12">
       {/* Sticky Header */}
       <div className="sticky top-24 z-30 bg-[#050505]/95 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-center relative mb-8">
          <button 
            onClick={handleBack} 
            className="absolute left-6 md:left-12 p-2 hover:bg-white/10 rounded-full transition-colors text-[#666] hover:text-white"
          >
            <ArrowLeft size={24} />
          </button>
          
          <div className="flex items-center gap-3">
             <Truck size={28} className="text-primary" />
             <h1 className="text-xl md:text-2xl font-bold text-white">Track Your Haul</h1>
          </div>
       </div>

      <div className="max-w-3xl mx-auto p-6 md:p-8 space-y-8 relative">
        <div className="text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
             <p className="text-[#888] font-medium text-lg text-center md:text-left">Enter your tracking number to get real-time updates and AI estimations.</p>
             <button 
                onClick={() => setShowHelp(!showHelp)}
                className="text-primary text-sm font-bold flex items-center gap-2 hover:underline"
             >
                <HelpCircle size={16} /> Where to find ID?
             </button>
        </div>

        {/* HELP CARD */}
        {showHelp && (
            <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 animate-fade-in-up">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                    <HelpCircle size={18} className="text-primary" /> Where is my Tracking Number?
                </h3>
                <p className="text-[#888] text-sm mb-4 leading-relaxed">
                    You get this number from your Agent (CNFans, Sugargoo, etc.) <b>after</b> you have paid for international shipping.
                </p>
                <div className="flex flex-col gap-2 text-sm text-[#ccc] mb-4">
                    <div className="flex items-center gap-2">
                        <span className="bg-[#333] px-2 py-1 rounded text-xs font-bold">Step 1</span> Go to your Agent's website (e.g., cnfans.com)
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="bg-[#333] px-2 py-1 rounded text-xs font-bold">Step 2</span> Navigate to <b>"My Parcels"</b>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="bg-[#333] px-2 py-1 rounded text-xs font-bold">Step 3</span> Look for tracking ID (starts with LY, EB, etc.)
                    </div>
                </div>
            </div>
        )}

        <div className="relative group">
            <input 
            type="text" 
            value={trackingNum}
            onChange={(e) => setTrackingNum(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
            placeholder="Tracking Number (e.g. LY123456789CN)"
            className="w-full bg-[#111111] border border-white/10 rounded-[20px] p-6 pl-6 pr-24 text-xl text-white focus:border-primary outline-none shadow-xl transition-all"
            />
            <button 
            onClick={handleTrack}
            disabled={loading}
            className="absolute right-3 top-3 bottom-3 px-6 bg-primary hover:bg-primaryHover rounded-xl font-bold text-black transition-colors disabled:opacity-50 shadow-lg shadow-primary/20"
            >
            {loading ? <Loader2 className="animate-spin" /> : 'Track'}
            </button>
        </div>

        {error && (
             <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl animate-fade-in-up">
                 <AlertCircle size={20} className="shrink-0" />
                 <p className="text-sm font-medium">{error}</p>
             </div>
        )}

        {data && (
            <div className="animate-fade-in-up space-y-6">
            {/* AI Insight Box */}
            <div className="bg-gradient-to-br from-[#111] to-[#0A0A0A] border border-indigo-500/20 rounded-[24px] p-6 relative overflow-hidden group hover:border-indigo-500/40 transition-colors shadow-lg shadow-indigo-500/5">
                <div className="flex items-start gap-4">
                <div className="bg-indigo-600/20 p-3 rounded-xl text-indigo-400 shrink-0">
                    <Sparkles size={24} />
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-indigo-300 text-sm mb-2 uppercase tracking-wide flex items-center gap-2">
                        AI Status Analysis <span className="bg-indigo-500/20 text-[10px] px-2 py-0.5 rounded-full border border-indigo-500/30">Gemini 2.5</span>
                    </h4>
                    {analyzing ? (
                    <div className="flex items-center gap-2 text-[#666] text-sm font-medium">
                        <Loader2 size={14} className="animate-spin" /> Analyzing logistics data...
                    </div>
                    ) : (
                    <p className="text-base text-slate-300 leading-relaxed font-medium">
                        {aiSummary}
                    </p>
                    )}
                </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-[#111111] border border-white/5 rounded-[24px] p-8 shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-white/5 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center border border-white/10">
                            <Truck size={20} className="text-[#888]" />
                        </div>
                        <div>
                            <div className="text-xs text-[#666] font-bold uppercase tracking-wider mb-1">Carrier</div>
                            <div className="font-bold text-white text-lg">{data.carrier}</div>
                        </div>
                    </div>
                    <div className="text-left md:text-right bg-primary/10 px-4 py-2 rounded-xl border border-primary/20">
                        <div className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Current Status</div>
                        <div className="font-bold text-white text-lg">{data.status}</div>
                    </div>
                </div>

                {data.steps.length > 0 ? (
                    <div className="space-y-10 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-[#222]">
                    {data.steps.map((step, idx) => (
                        <div key={idx} className="relative flex gap-8 group">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-[#111111] transition-transform group-hover:scale-110 ${idx === 0 ? 'bg-primary text-black shadow-[0_0_20px_rgba(217,142,4,0.3)]' : 'bg-[#1A1A1A] border-white/10 text-[#444]'}`}>
                            {idx === 0 ? <Truck size={18} /> : <div className="w-2 h-2 rounded-full bg-[#333]"></div>}
                        </div>
                        <div className={`${idx === 0 ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'} transition-opacity`}>
                            <div className="text-xs text-[#666] font-bold mb-1 flex items-center gap-2">
                                {step.date}
                                {idx === 0 && <span className="bg-primary text-black text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">Latest</span>}
                            </div>
                            <div className={`font-bold text-lg mb-1 leading-tight ${idx === 0 ? 'text-white' : 'text-[#888]'}`}>{step.status}</div>
                            <div className="text-sm text-[#666] font-medium max-w-md">{step.location} {step.description ? `- ${step.description}` : ''}</div>
                        </div>
                        </div>
                    ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-[#666] flex flex-col items-center">
                        <AlertCircle size={32} className="mb-3 opacity-50" />
                        <p>No tracking events found yet.</p>
                        <p className="text-xs mt-2">The carrier may not have updated their system yet.</p>
                    </div>
                )}
            </div>
            </div>
        )}
      </div>
    </div>
  );
};