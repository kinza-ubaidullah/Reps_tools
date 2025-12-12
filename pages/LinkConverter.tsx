
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, Copy, Check, ArrowLeft, ExternalLink, RotateCcw, Search, Smartphone, Globe } from 'lucide-react';
import { MOCK_AGENTS } from '../constants';

export const LinkConverter: React.FC = () => {
  const navigate = useNavigate();
  const [inputLink, setInputLink] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(MOCK_AGENTS[0].id);
  const [convertedLink, setConvertedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // --- CUSTOM BUILD CONVERTER LOGIC ---
  // This runs completely client-side using robust regex patterns.
  // It effectively replaces the need for a simple conversion API.
  const handleConvert = () => {
    if (!inputLink) return;
    setError('');
    setConvertedLink('');
    
    let itemId = '';
    let platform = '';
    let rawLink = inputLink;

    // 1. Handle Mobile/Short Links (Basic decoding if it's a redirect, otherwise needs backend)
    // Note: True short link expansion (e.g. m.tb.cn) usually requires a backend fetch to follow redirects.
    // Here we handle recognizable patterns in standard mobile URLs.
    
    // 2. Regex Extraction Strategy
    const patterns = [
        { regex: /[?&]id=(\d+)/, platform: 'taobao' },
        { regex: /item\.taobao\.com\/item\.htm\?.*id=(\d+)/, platform: 'taobao' },
        { regex: /[?&]itemID=(\d+)/, platform: 'weidian' },
        { regex: /weidian\.com\/item\.html\?.*itemID=(\d+)/, platform: 'weidian' },
        { regex: /offer\/(\d+)\.html/, platform: '1688' },
        { regex: /detail\.1688\.com\/offer\/(\d+)/, platform: '1688' }
    ];

    for (const p of patterns) {
        const match = rawLink.match(p.regex);
        if (match && match[1]) {
            itemId = match[1];
            platform = p.platform;
            break;
        }
    }

    if (!itemId) {
        setError("Could not detect a valid Product ID. Please ensure the link is a full URL from Taobao, Weidian, or 1688.");
        return;
    }

    // 3. Construct Clean Source URL
    let cleanSourceUrl = '';
    if (platform === 'taobao') cleanSourceUrl = `https://item.taobao.com/item.htm?id=${itemId}`;
    if (platform === 'weidian') cleanSourceUrl = `https://weidian.com/item.html?itemID=${itemId}`;
    if (platform === '1688') cleanSourceUrl = `https://detail.1688.com/offer/${itemId}.html`;

    // 4. Generate Agent Link
    const agent = MOCK_AGENTS.find(a => a.id === selectedAgent);
    if (!agent) return;

    let finalLink = '';
    const agentName = agent.name.toLowerCase();

    // Custom Logic for specific agents
    if (agentName.includes('cnfans')) {
        finalLink = `https://cnfans.com/product/?shop_type=${platform}&id=${itemId}`;
    } 
    else if (agentName.includes('mulebuy')) {
        finalLink = `https://mulebuy.com/product/?shop_type=${platform}&id=${itemId}`;
    }
    else if (agentName.includes('superbuy')) {
        finalLink = `https://www.superbuy.com/en/page/buy?nTag=Home-search&from=search-input&url=${encodeURIComponent(cleanSourceUrl)}`;
    } 
    else if (agentName.includes('sugargoo')) {
        finalLink = `https://www.sugargoo.com/#/home/productDetail?productLink=${encodeURIComponent(cleanSourceUrl)}`;
    }
    else if (agentName.includes('kakobuy')) {
        finalLink = `https://www.kakobuy.com/item/details?url=${encodeURIComponent(cleanSourceUrl)}`;
    }
    else if (agentName.includes('joyagoo')) {
        finalLink = `https://joyagoo.com/index/item/index.html?tp=${platform}&id=${itemId}`;
    }
    else {
        // Generic Fallback
        finalLink = `${agent.website}/item?id=${itemId}&type=${platform}`;
    }
    
    setConvertedLink(finalLink);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(convertedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
      setInputLink('');
      setConvertedLink('');
      setError('');
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
             <Link size={28} className="text-primary" />
             <h1 className="text-xl md:text-2xl font-bold text-white">Affiliate Converter</h1>
          </div>
       </div>

       <div className="max-w-2xl mx-auto p-6 md:p-8 space-y-6">
        <div className="bg-[#111111] border border-white/10 rounded-[32px] p-8 shadow-xl">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-white">
                <Globe className="text-primary" /> Universal Link Engine
            </h2>
            <p className="text-[#666] mb-8 font-medium">
                Our custom-built engine instantly converts raw Taobao, Weidian, and 1688 links into your preferred agent link. 
                <span className="text-primary ml-1">No external API required.</span>
            </p>

            {/* GUIDANCE BOX */}
            <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#222] rounded-full text-[#888]">
                        <Smartphone size={18} />
                    </div>
                    <div className="text-sm">
                        <span className="block font-bold text-white">Mobile Links Supported</span>
                        <span className="text-[#666]">Engine auto-detects IDs from most mobile URLs.</span>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="text-xs font-bold text-[#666] uppercase tracking-wider block mb-3">Select Target Agent</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {MOCK_AGENTS.map(agent => (
                            <button 
                                key={agent.id}
                                onClick={() => setSelectedAgent(agent.id)}
                                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                                    selectedAgent === agent.id 
                                    ? 'bg-primary/20 border-primary text-white' 
                                    : 'bg-[#1A1A1A] border-white/5 text-[#666] hover:border-white/20 hover:text-white'
                                }`}
                            >
                                <img src={agent.logo} alt={agent.name} className="w-6 h-6 rounded-sm object-contain" />
                                <span className="text-xs font-bold">{agent.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-[#666] uppercase tracking-wider block mb-3">Product Link</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={inputLink}
                            onChange={(e) => setInputLink(e.target.value)}
                            placeholder="Paste Taobao, Weidian or 1688 link..."
                            className="flex-1 bg-[#0A0A0A] border border-[#222] rounded-xl p-4 text-white focus:border-white/20 outline-none text-sm font-medium"
                        />
                        <button 
                            onClick={handleReset}
                            className="p-4 bg-[#1A1A1A] hover:bg-[#222] text-[#666] hover:text-white rounded-xl border border-white/5 transition-colors"
                            title="Reset"
                        >
                            <RotateCcw size={20} />
                        </button>
                    </div>
                </div>
                
                {error && <p className="text-red-400 text-sm font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}

                <button 
                    onClick={handleConvert}
                    className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors shadow-lg shadow-white/5"
                >
                    Convert Link
                </button>

                {convertedLink && (
                    <div className="mt-6 space-y-3 animate-fade-in-up">
                        <div className="p-4 bg-[#0A0A0A] rounded-xl border border-[#222] flex items-center gap-3">
                            <div className="flex-1 truncate text-emerald-400 font-mono text-sm">
                                {convertedLink}
                            </div>
                            <button 
                                onClick={copyToClipboard}
                                className="p-2 bg-[#1A1A1A] hover:bg-[#222] rounded-lg text-white transition-colors"
                                title="Copy"
                            >
                                {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                            </button>
                        </div>
                        <a 
                            href={convertedLink} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl hover:bg-emerald-500 hover:text-black transition-all font-bold text-sm"
                        >
                            <ExternalLink size={16} /> Open Link
                        </a>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
