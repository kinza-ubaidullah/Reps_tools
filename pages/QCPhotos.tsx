
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ArrowLeft, AlertCircle, Loader2, X, ZoomIn, Download, Server, User as UserIcon } from 'lucide-react';
import { fetchQCPhotos, QCPhoto } from '../services/qcService';

export const QCPhotos: React.FC = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [photos, setPhotos] = useState<QCPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleLookup = async () => {
    if(!url) return;
    setLoading(true);
    setError('');
    setPhotos([]);

    try {
        const result = await fetchQCPhotos(url);
        
        if (result.length > 0) {
            setPhotos(result);
        } else {
            setError("No photos found. The item might be new or has no reviews.");
        }
    } catch (err: any) {
        console.error(err);
        setError("Could not retrieve photos. Please try a different link.");
    } finally {
        setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/', { state: { scrollTo: 'tools-section' } });
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-28">
       <div className="sticky top-24 z-30 bg-[#050505]/95 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-center relative mb-8">
          <button 
            onClick={handleBack} 
            className="absolute left-6 md:left-12 p-2 hover:bg-white/10 rounded-full transition-colors text-[#666] hover:text-white"
          >
            <ArrowLeft size={24} />
          </button>
          
          <div className="flex items-center gap-3">
             <Camera size={28} className="text-primary" />
             <h1 className="text-xl md:text-2xl font-bold text-white">QC Photo Finder</h1>
          </div>
       </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 space-y-8 pb-12">
        <div className="text-center max-w-lg mx-auto">
            <p className="text-slate-400 font-medium">
                Enter a Taobao/Weidian link to inspect photos. 
                <br/>
                <span className="text-xs text-[#666] mt-2 block">
                    Supports: Warehouse QC & Real Customer Reviews
                </span>
            </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
            <div className="relative group">
                <input 
                    type="text" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                    placeholder="Paste Product URL (Taobao/Weidian)"
                    className="w-full bg-[#111] border border-white/10 rounded-2xl px-6 py-4 pr-32 focus:border-primary outline-none text-white shadow-xl transition-all"
                />
                <button 
                    onClick={handleLookup}
                    disabled={loading}
                    className="absolute right-2 top-2 bottom-2 px-6 bg-primary hover:bg-primaryHover text-black font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {loading && <Loader2 className="animate-spin" size={18} />}
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>
            
            {error && (
                <div className="flex items-start gap-3 p-4 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-400">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <span className="font-medium leading-relaxed">{error}</span>
                </div>
            )}
        </div>

        {photos.length > 0 && (
            <div className="space-y-4 animate-fade-in-up">
                <div className="flex justify-between items-center px-2 border-b border-white/5 pb-4">
                    <h3 className="font-bold text-white flex items-center gap-2">
                         Found {photos.length} Photos
                    </h3>
                    <div className="flex gap-4">
                        <span className="text-xs text-[#666] font-bold uppercase tracking-wider flex items-center gap-1">
                            <Server size={12} /> Source: {photos[0].provider === 'TaobaoReviews' ? 'Customer Reviews' : 'Warehouse Data'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {photos.map((photo, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => setSelectedImage(photo.url)}
                            className="aspect-square bg-[#111] rounded-2xl overflow-hidden border border-white/5 cursor-pointer group relative hover:border-primary/50 transition-all"
                        >
                            <img src={photo.url} alt={`QC ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            
                            <div className="absolute top-2 left-2">
                                {photo.provider === 'TaobaoReviews' ? (
                                    <span className="bg-black/70 backdrop-blur-md text-white text-[9px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                                        <UserIcon size={8} /> Review
                                    </span>
                                ) : (
                                    <span className="bg-primary/90 text-black text-[9px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                                        <Server size={8} /> QC
                                    </span>
                                )}
                            </div>

                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                                <ZoomIn size={32} className="text-white mb-2" />
                                <span className="text-[10px] text-gray-300">{photo.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up">
            <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 p-2 bg-[#222] hover:bg-white hover:text-black text-white rounded-full transition-colors z-50"
            >
                <X size={24} />
            </button>
            
            <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center">
                <img 
                    src={selectedImage} 
                    alt="QC Full" 
                    className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
                    <a 
                        href={selectedImage} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-[#111] hover:bg-primary hover:text-black text-white border border-white/10 rounded-xl font-bold transition-colors shadow-lg"
                    >
                        <Download size={18} /> Open Original
                    </a>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
