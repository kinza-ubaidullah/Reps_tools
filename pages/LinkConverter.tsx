
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, Copy, Check, ArrowLeft, ExternalLink, RotateCcw, Smartphone, Globe } from 'lucide-react';
import { MOCK_AGENTS } from '../constants';

// Configure your affiliate codes here
const REF_CODES: Record<string, string> = {
    'cnfans': 'AnyReps',
    'mulebuy': 'AnyReps',
    'joyagoo': 'AnyReps',
    'kakobuy': 'AnyReps',
    'litbuy': 'AnyReps',
    'sugargoo': '', // Add specific member ID if needed
    'orientdig': 'AnyReps'
};

export const LinkConverter: React.FC = () => {
  const navigate = useNavigate();
  const [inputLink, setInputLink] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(MOCK_AGENTS[0].id);
  const [convertedLink, setConvertedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleConvert = () => {
    if (!inputLink) return;
    setError('');
    setConvertedLink('');
    
    let itemId = '';
    let platform = ''; // 'taobao', 'weidian', '1688'
    const rawLink = inputLink.trim();

    // ---------------------------------------------------------
    // 1. PARSE INPUT (Support Raw Links & Agent Links)
    // ---------------------------------------------------------
    
    try {
        // Attempt to parse as URL object to easily access query params
        // This handles standard URLs: https://...
        const urlObj = new URL(rawLink);
        const params = new URLSearchParams(urlObj.search);

        // A. Extract ID from params (Common across agents and marketplaces)
        // Checks for id, itemID (Weidian), num_iid (Taobao), offerId (1688)
        if (params.get('id')) itemId = params.get('id')!;
        else if (params.get('itemID')) itemId = params.get('itemID')!;
        else if (params.get('num_iid')) itemId = params.get('num_iid')!;
        else if (params.get('offerId')) itemId = params.get('offerId')!;

        // B. Extract Platform from params (Crucial for Agent links which have shop_type)
        const typeParam = params.get('shop_type') || params.get('type') || params.get('platform');
        if (typeParam) {
             const t = typeParam.toLowerCase();
             if (t.includes('weidian')) platform = 'weidian';
             else if (t.includes('taobao') || t.includes('tmall')) platform = 'taobao';
             else if (t.includes('1688') || t.includes('ali')) platform = '1688';
        }

        // C. If platform not found in params, check domain name
        if (!platform) {
            const hostname = urlObj.hostname.toLowerCase();
            if (hostname.includes('weidian') || hostname.includes('koudai')) platform = 'weidian';
            else if (hostname.includes('taobao') || hostname.includes('tmall')) platform = 'taobao';
            else if (hostname.includes('1688')) platform = '1688';
        }

    } catch (e) {
        // Not a standard URL object (might be a partial string), proceed to regex fallback
    }

    // 2. FALLBACK REGEX (If URL parsing failed or missed ID)
    if (!itemId) {
        // 1688 standard path
        const m1688 = rawLink.match(/offer\/(\d+)\.html/);
        if (m1688) { itemId = m1688[1]; platform = '1688'; }
        
        // Weidian standard (Case insensitive for itemID)
        const mWeidian = rawLink.match(/itemID=(\d+)/i);
        if (mWeidian) { itemId = mWeidian[1]; platform = 'weidian'; }
        
        // Taobao standard
        const mTaobao = rawLink.match(/id=(\d+)/i);
        if (mTaobao) { itemId = mTaobao[1]; if(!platform) platform = 'taobao'; }
    }

    // 3. ROBUST PLATFORM CHECK (Final Safety Net)
    // If ID found but Platform still missing (e.g. URL parsing worked for ID but hostname check failed)
    if (itemId && !platform) {
        const lowerLink = rawLink.toLowerCase();
        if (lowerLink.includes('weidian') || lowerLink.includes('koudai')) platform = 'weidian';
        else if (lowerLink.includes('1688')) platform = '1688';
        else if (lowerLink.includes('taobao') || lowerLink.includes('tmall')) platform = 'taobao';
    }

    // 4. DEFAULT
    // Default to Taobao as it's the most common if still undetected
    if (itemId && !platform) platform = 'taobao';

    if (!itemId) {
        setError("Could not detect a valid Product ID. Please ensure the link is a valid product URL from a marketplace or agent.");
        return;
    }

    // ---------------------------------------------------------
    // 5. GENERATE AGENT LINK
    // ---------------------------------------------------------

    const agent = MOCK_AGENTS.find(a => a.id === selectedAgent);
    if (!agent) return;

    let finalLink = '';
    const agentName = agent.name.toLowerCase();
    const refCode = REF_CODES[agentName.replace(/[^a-z]/g, '')] || '';

    // Construct Clean Source URL (Required for some agents like Sugargoo/Superbuy)
    let cleanSourceUrl = '';
    if (platform === 'taobao') cleanSourceUrl = `https://item.taobao.com/item.htm?id=${itemId}`;
    if (platform === 'weidian') cleanSourceUrl = `https://weidian.com/item.html?itemID=${itemId}`;
    if (platform === '1688') cleanSourceUrl = `https://detail.1688.com/offer/${itemId}.html`;

    // Agent-Specific Construction
    if (agentName.includes('cnfans')) {
        finalLink = `https://cnfans.com/product/?shop_type=${platform}&id=${itemId}`;
        if (refCode) finalLink += `&ref=${refCode}`;
    } 
    else if (agentName.includes('mulebuy')) {
        finalLink = `https://mulebuy.com/product/?shop_type=${platform}&id=${itemId}`;
        if (refCode) finalLink += `&ref=${refCode}`;
    }
    else if (agentName.includes('litbuy')) {
        finalLink = `https://www.litbuy.com/product/?shop_type=${platform}&id=${itemId}`;
        if (refCode) finalLink += `&ref=${refCode}`;
    }
    else if (agentName.includes('joyagoo')) {
        // JoyaGoo typically uses 'tp' or 'type' for shop type
        finalLink = `https://joyagoo.com/index/item/index.html?tp=${platform}&id=${itemId}`;
        if (refCode) finalLink += `&ref=${refCode}`;
    }
    else if (agentName.includes('kakobuy')) {
        finalLink = `https://www.kakobuy.com/item/details?url=${encodeURIComponent(cleanSourceUrl)}`;
        if (refCode) finalLink += `&aff=${refCode}`;
    }
    else if (agentName.includes('superbuy')) {
        finalLink = `https://www.superbuy.com/en/page/buy?nTag=Home-search&from=search-input&url=${encodeURIComponent(cleanSourceUrl)}`;
        if (refCode) finalLink += `&partnercode=${refCode}`;
    } 
    else if (agentName.includes('sugargoo')) {
        finalLink = `https://www.sugargoo.com/#/home/productDetail?productLink=${encodeURIComponent(cleanSourceUrl)}`;
        if (refCode) finalLink += `&memberId=${refCode}`;
    }
    else if (agentName.includes('orientdig')) {
        finalLink = `https://orientdig.com/product/?shop_type=${platform}&id=${itemId}`;
        if (refCode) finalLink += `&ref=${refCode}`;
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
                Our custom-built engine instantly converts raw Taobao, Weidian, 1688, and 
                <span className="text-white"> existing agent links</span> into your preferred agent link. 
                <span className="text-primary ml-1 block mt-1 text-xs uppercase tracking-wide font-bold">Now with Auto-Referral Injection</span>
            </p>

            {/* GUIDANCE BOX */}
            <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#222] rounded-full text-[#888]">
                        <Smartphone size={18} />
                    </div>
                    <div className="text-sm">
                        <span className="block font-bold text-white">Smart Parsing</span>
                        <span className="text-[#666]">Works with direct links and agent links (e.g. from Mulebuy to CNFans).</span>
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
                            placeholder="Paste link (Raw or Agent)..."
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
