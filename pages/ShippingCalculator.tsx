
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { COUNTRIES } from '../constants';
import { calculateShipping, ShippingResult } from '../services/shippingService';
import { getUserLocation } from '../services/ipService';
import { Package, ArrowRight, ArrowLeft, Calculator, Loader2, AlertCircle, MapPin } from 'lucide-react';

export const ShippingCalculator: React.FC = () => {
  const navigate = useNavigate();
  
  // Inputs
  const [weight, setWeight] = useState<number>(1000);
  const [length, setLength] = useState<number>(30);
  const [width, setWidth] = useState<number>(20);
  const [height, setHeight] = useState<number>(10);
  const [country, setCountry] = useState<string>('USA');
  
  // State
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ShippingResult[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [locating, setLocating] = useState(true);

  // IP INTEGRATION: Auto-detect country on mount
  useEffect(() => {
    const detectCountry = async () => {
        const detectedCountry = await getUserLocation();
        
        // Match detected country with our supported list
        // If exact match found, use it. If not, check if list contains part of it (e.g. "United States" vs "USA")
        const match = COUNTRIES.find(c => 
            c.toLowerCase() === detectedCountry.toLowerCase() || 
            detectedCountry.toLowerCase().includes(c.toLowerCase()) ||
            (c === 'USA' && detectedCountry === 'United States')
        );

        if (match) {
            setCountry(match);
        }
        setLocating(false);
    };

    detectCountry();
  }, []);

  const handleCalculate = async () => {
    setLoading(true);
    setResults([]);
    
    // Call the new service
    const data = await calculateShipping({
        weight,
        length,
        width,
        height,
        country
    });

    setResults(data);
    setHasCalculated(true);
    setLoading(false);
  };

  const handleBack = () => {
    navigate('/', { state: { scrollTo: 'tools-section' } });
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-28">
       {/* Sticky Header */}
       <div className="sticky top-24 z-30 bg-[#050505]/95 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-center relative mb-8">
          <button 
            onClick={handleBack} 
            className="absolute left-6 md:left-12 p-2 hover:bg-white/10 rounded-full transition-colors text-[#666] hover:text-white"
          >
            <ArrowLeft size={24} />
          </button>
          
          <div className="flex items-center gap-3">
             <Calculator size={28} className="text-primary" />
             <h1 className="text-xl md:text-2xl font-bold text-white">Shipping Calculator</h1>
          </div>
       </div>

      <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-8">
        
        {/* INPUT BOX */}
        <div className="bg-[#111111] border border-white/10 rounded-[32px] p-8 shadow-xl">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2 text-white">
               <Package className="text-primary" /> Package Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Weight & Dest */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-[#666] uppercase tracking-wider mb-3">Weight (grams)</label>
                        <input 
                            type="number" 
                            value={weight}
                            onChange={(e) => setWeight(Number(e.target.value))}
                            className="w-full bg-[#0A0A0A] border border-[#222] rounded-xl p-4 text-white focus:border-white/20 outline-none font-medium text-lg"
                            placeholder="e.g. 1500"
                        />
                    </div>
                    <div>
                        <label className="flex justify-between items-center text-xs font-bold text-[#666] uppercase tracking-wider mb-3">
                            Destination
                            {locating ? (
                                <span className="flex items-center gap-1 text-primary lowercase font-normal"><Loader2 size={10} className="animate-spin"/> locating...</span>
                            ) : (
                                <span className="flex items-center gap-1 text-emerald-500 lowercase font-normal"><MapPin size={10}/> auto-detected</span>
                            )}
                        </label>
                        <select 
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full bg-[#0A0A0A] border border-[#222] rounded-xl p-4 text-white focus:border-white/20 outline-none font-medium appearance-none text-lg cursor-pointer"
                        >
                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                {/* Right: Dimensions */}
                <div className="space-y-6">
                    <label className="block text-xs font-bold text-[#666] uppercase tracking-wider">Dimensions (cm)</label>
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                             <span className="block text-[10px] text-[#444] mb-1 font-bold">Length</span>
                             <input 
                                type="number" 
                                value={length}
                                onChange={(e) => setLength(Number(e.target.value))}
                                className="w-full bg-[#0A0A0A] border border-[#222] rounded-xl p-3 text-white text-center font-bold"
                             />
                        </div>
                        <div>
                             <span className="block text-[10px] text-[#444] mb-1 font-bold">Width</span>
                             <input 
                                type="number" 
                                value={width}
                                onChange={(e) => setWidth(Number(e.target.value))}
                                className="w-full bg-[#0A0A0A] border border-[#222] rounded-xl p-3 text-white text-center font-bold"
                             />
                        </div>
                        <div>
                             <span className="block text-[10px] text-[#444] mb-1 font-bold">Height</span>
                             <input 
                                type="number" 
                                value={height}
                                onChange={(e) => setHeight(Number(e.target.value))}
                                className="w-full bg-[#0A0A0A] border border-[#222] rounded-xl p-3 text-white text-center font-bold"
                             />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button 
                            onClick={handleCalculate}
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primaryHover text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Estimate Costs'}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* RESULTS */}
        {hasCalculated && (
            <div className="space-y-4 animate-fade-in-up">
            <div className="flex justify-between items-center px-2">
                <h3 className="font-bold text-white text-lg">Best Options for {weight}g to {country}</h3>
                <span className="text-xs text-[#666]">Sorted by Price: Low to High</span>
            </div>
            
            {results.length > 0 ? (
                results.map((res, idx) => (
                    <div key={idx} className="bg-[#111111] hover:bg-[#161616] border border-white/5 hover:border-white/10 rounded-[24px] p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-all group relative overflow-hidden">
                        
                        {/* Volumetric Warning Strip */}
                        {res.isVolumetric && (
                            <div className="absolute top-0 right-0 bg-yellow-500/10 text-yellow-500 text-[9px] px-3 py-1 font-bold uppercase rounded-bl-xl border-l border-b border-yellow-500/20">
                                Volumetric Weight Applied: {res.chargedWeight}g
                            </div>
                        )}

                        <div className="flex items-center gap-5 flex-1 w-full md:w-auto">
                            <div className="w-14 h-14 rounded-xl bg-white p-2 flex items-center justify-center shrink-0">
                                <img src={res.agentLogo} alt={res.agentName} className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <div className="font-bold text-lg text-white group-hover:text-primary transition-colors">{res.agentName}</div>
                                <div className="text-[#888] text-sm font-medium">{res.lineName}</div>
                                <div className="flex gap-2 mt-2 flex-wrap">
                                    {res.features.map((f: string) => (
                                        <span key={f} className="text-[10px] bg-[#222] px-2 py-0.5 rounded text-[#aaa] font-bold uppercase tracking-wide">{f}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between w-full md:w-auto gap-8 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                            <div className="text-center px-4 md:border-l md:border-r border-white/5">
                                <div className="text-xl font-bold text-white">{res.deliveryMin}-{res.deliveryMax}</div>
                                <div className="text-[10px] text-[#666] font-bold uppercase tracking-wider">Days</div>
                            </div>

                            <div className="text-right min-w-[100px]">
                                <div className="text-2xl font-bold text-emerald-400">${res.totalPrice}</div>
                                <div className="text-[10px] text-[#666] font-bold uppercase tracking-wider">Est. Total</div>
                            </div>
                            
                            <a 
                                href={res.agentWebsite} 
                                target="_blank" 
                                rel="noreferrer"
                                className="p-3 bg-[#1A1A1A] hover:bg-primary hover:text-black rounded-xl transition-colors text-white flex items-center justify-center border border-white/5"
                                title={`Go to ${res.agentName}`}
                            >
                                <ArrowRight size={20} />
                            </a>
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-8 text-center border border-white/5 rounded-[24px] bg-[#111]">
                    <AlertCircle className="mx-auto text-red-400 mb-4" size={32} />
                    <h3 className="text-white font-bold text-lg">No Shipping Lines Found</h3>
                    <p className="text-[#666]">The package weight might be too high for available lines.</p>
                </div>
            )}
            </div>
        )}
      </div>
    </div>
  );
};
