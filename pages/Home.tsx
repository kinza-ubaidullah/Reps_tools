
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Plus, 
  Truck, 
  Link as LinkIcon, 
  Sparkles, 
  ArrowRight, 
  Calculator, 
  Image, 
  Camera, 
  Flame, 
  Database, 
  BarChart3, 
  LayoutGrid,
  Quote,
  Github,
  Linkedin,
  Twitter,
  Gamepad2
} from 'lucide-react';

// --- Components ---

const ProductCard = ({ title, price, brand, image, to }: { title: string, price: number, brand: string, image: string, to: string }) => (
  <div className="flex flex-col gap-4 group cursor-pointer">
    {/* Image Frame - Dark Background */}
    <div className="bg-[#111111] rounded-[32px] aspect-[16/10] relative overflow-hidden border border-transparent group-hover:border-white/5 transition-colors">
      
      {/* Plus Button - Top Right Corner - Functional Link */}
      <Link to={to} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-colors z-30 shadow-lg shadow-black/40">
        <Plus size={18} />
      </Link>

      {/* Image Container */}
      <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
         <img 
          src={image} 
          alt={title} 
          className="w-[85%] h-[85%] object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 -rotate-[25deg] translate-y-2" 
         />
      </div>
      
      <Link to={to} className="absolute inset-0 z-10" />
    </div>

    {/* Product Data - Outside the Frame */}
    <div className="px-1">
        <div className="flex justify-between items-start mb-1">
            <h3 className="text-white font-medium text-lg leading-tight">{title}</h3>
            <span className="text-white font-bold text-lg">${price}</span>
        </div>
        <p className="text-[#666] text-xs font-bold tracking-widest uppercase">BRAND : <span className="text-[#888] ml-1">{brand}</span></p>
    </div>
  </div>
);

const BrandList = () => (
    <div className="w-full flex justify-center py-10 bg-[#050505]">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 px-6">
            <span className="text-lg font-bold text-[#888] hover:text-white transition-colors cursor-pointer font-serif italic">acbuy</span>
            <span className="text-lg font-bold text-[#888] hover:text-white transition-colors cursor-pointer">cn·fans</span>
            <span className="text-lg font-bold text-[#888] hover:text-white transition-colors cursor-pointer">Mulebuy</span>
            <span className="text-lg font-bold text-[#888] hover:text-white transition-colors cursor-pointer font-mono">KakoBuy</span>
            <span className="text-lg font-bold text-[#888] hover:text-white transition-colors italic cursor-pointer">OrientDig</span>
            <span className="text-lg font-bold text-[#888] hover:text-white transition-colors cursor-pointer">LitBuy</span>
        </div>
    </div>
);

const HeroToolWidget = () => {
  const [activeTab, setActiveTab] = useState<'tracking' | 'converter' | 'qc'>('tracking');
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (activeTab === 'tracking') {
        navigate('/tracking');
    } else if (activeTab === 'converter') {
        navigate('/converter');
    } else if (activeTab === 'qc') {
        navigate('/qc');
    }
  };

  return (
    <div className="mt-12 w-full max-w-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
       {/* Tabs */}
       <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('tracking')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'tracking' 
                ? 'bg-[#1A1A1A] text-white border border-white/10' 
                : 'text-[#666] hover:text-white'
            }`}
          >
            <Truck size={16} /> Time tracking
          </button>
          
          <button 
             onClick={() => setActiveTab('converter')}
             className={`flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'converter' 
                ? 'text-white' 
                : 'text-[#666] hover:text-white'
             }`}
          >
             <LinkIcon size={16} /> Link converter
          </button>

          <button 
             onClick={() => setActiveTab('qc')}
             className={`flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'qc' 
                ? 'text-white' 
                : 'text-[#666] hover:text-white'
             }`}
          >
             <Sparkles size={16} /> Quality check
          </button>
       </div>

       {/* Description */}
       <p className="text-[#666] text-sm leading-relaxed mb-6 font-medium">
          {activeTab === 'tracking' && "Enter your package number in the field below to monitor its status and check the estimated delivery time"}
          {activeTab === 'converter' && "Paste a raw product link to convert it to a trusted agent link instantly"}
          {activeTab === 'qc' && "Check actual warehouse photos from previous orders to verify quality before purchasing"}
       </p>
       
       {/* Input Field */}
       <div className="relative group">
           <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={activeTab === 'tracking' ? "Enter tracking number..." : "Paste product link..."}
              className="w-full bg-[#0A0A0A] border border-[#222] rounded-xl px-5 py-4 text-white placeholder:text-[#444] outline-none focus:border-white/20 transition-all text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
           />
           <button 
             onClick={handleSubmit}
             className="absolute right-2 top-2 bottom-2 bg-[#1A1A1A] hover:bg-white hover:text-black text-white px-4 rounded-lg transition-colors border border-white/5 flex items-center justify-center"
           >
              <ArrowRight size={18} />
           </button>
       </div>
    </div>
  );
};

const ToolsSection = () => {
    // Uses a 12-column grid system to create the Bento Box effect
    const tools = [
        // ROW 1: 3 Items (Equal Width)
        { icon: Calculator, color: 'bg-blue-600', title: 'Shipping calculator', desc: 'Calculate shipping costs with real time rates', link: '/calculator', span: 'col-span-1 md:col-span-4' },
        { icon: Sparkles, color: 'bg-red-600', title: 'Product Search', desc: 'Find products on taobao and weidian with ease', link: '/search', span: 'col-span-1 md:col-span-4' },
        { icon: LinkIcon, color: 'bg-emerald-500', title: 'Link converter', desc: 'Convert and get any product instantly', link: '/converter', span: 'col-span-1 md:col-span-4' },
        
        // ROW 2: W2C (Smaller) + QC (Larger)
        { icon: Image, color: 'bg-yellow-500', title: 'W2C Gallery', desc: 'Browse big link base', link: '/community/w2c', span: 'col-span-1 md:col-span-5' },
        { icon: Camera, color: 'bg-pink-600', title: 'QC photo viewer', desc: 'View quality check photos before buying', link: '/qc', span: 'col-span-1 md:col-span-7' },
        
        // ROW 3: Hot Selling (Smaller) + Spreadsheets (Larger/Wide)
        { icon: Flame, color: 'bg-purple-600', title: 'Hot selling products', desc: 'Discover trending products', link: '/community/hot', span: 'col-span-1 md:col-span-4' },
        { icon: Database, color: 'bg-green-600', title: 'Spreadsheets Search', desc: 'Dive into more than 15,000 + links', link: '/community/sheets', span: 'col-span-1 md:col-span-8' },
        
        // ROW 4: Top Sellers + Wishlist (Equal Width)
        { icon: BarChart3, color: 'bg-orange-600', title: 'Top sellers', desc: 'Find trusted sellers', link: '/sellers', span: 'col-span-1 md:col-span-6' },
        { icon: LayoutGrid, color: 'bg-blue-500', title: 'Wish list', desc: 'Save and organize your favorite items', link: '/wishlist', span: 'col-span-1 md:col-span-6' },
    ];

    return (
        <div id="tools-section" className="max-w-[1400px] mx-auto px-6 md:px-12 py-20">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-3">Tools</h2>
                <p className="text-[#666] font-medium">What we have produced over the years</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {tools.map((tool, idx) => (
                    <Link 
                        key={idx} 
                        to={tool.link}
                        className={`${tool.span} bg-[#111] border border-white/5 hover:border-white/10 rounded-[32px] p-8 flex flex-col items-center text-center gap-4 transition-all duration-300 hover:-translate-y-1 group`}
                    >
                        <div className={`w-14 h-14 rounded-2xl ${tool.color} flex items-center justify-center text-white mb-2 shadow-lg shadow-black/20 group-hover:scale-110 transition-transform`}>
                            <tool.icon size={28} strokeWidth={2} />
                        </div>
                        <h3 className="text-xl font-bold text-white">{tool.title}</h3>
                        <p className="text-sm text-[#666] font-medium leading-relaxed max-w-[220px]">
                            {tool.desc}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

const TestimonialsSection = () => {
  const testimonials = Array(6).fill({
    name: "Jacky wills",
    role: "Client",
    title: "Founder of Azmir tech",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop",
    text: "forsi is the best and he loves devbucks... forsi is the best and he loves devbucks...forsi is the best and he loves devbucks"
  });

  return (
    <div className="w-full py-10 bg-[#050505] overflow-hidden space-y-6">
        {/* Row 1 - Scroll Left */}
        <div className="flex w-max gap-6 animate-infinite-scroll hover:pause">
            {[...testimonials, ...testimonials].map((t, i) => (
                <div key={`row1-${i}`} className="bg-[#111] p-8 rounded-[32px] w-[450px] shrink-0 border border-white/5 relative group hover:border-white/10 transition-colors">
                     <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 border border-white/10">
                                <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-lg leading-tight">{t.name}</h4>
                                <p className="text-[#666] text-sm font-medium">{t.role}</p>
                            </div>
                        </div>
                        <p className="text-[#444] text-xs font-bold uppercase tracking-wider mt-1">{t.title}</p>
                     </div>
                     
                     <Quote className="text-[#222] fill-current mb-4" size={32} />
                     
                     <p className="text-[#888] font-medium leading-relaxed text-sm">
                        {t.text}
                     </p>
                </div>
            ))}
        </div>

        {/* Row 2 - Scroll Right */}
        <div className="flex w-max gap-6 animate-infinite-scroll hover:pause" style={{ animationDirection: 'reverse' }}>
            {[...testimonials, ...testimonials].map((t, i) => (
                <div key={`row2-${i}`} className="bg-[#111] p-8 rounded-[32px] w-[450px] shrink-0 border border-white/5 relative group hover:border-white/10 transition-colors">
                     <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 border border-white/10">
                                <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-lg leading-tight">{t.name}</h4>
                                <p className="text-[#666] text-sm font-medium">{t.role}</p>
                            </div>
                        </div>
                        <p className="text-[#444] text-xs font-bold uppercase tracking-wider mt-1">{t.title}</p>
                     </div>
                     
                     <Quote className="text-[#222] fill-current mb-4" size={32} />
                     
                     <p className="text-[#888] font-medium leading-relaxed text-sm">
                        {t.text}
                     </p>
                </div>
            ))}
        </div>
    </div>
  );
};

const SupportedAgents = () => (
    <div id="community-section" className="w-full py-24 bg-[#050505] border-t border-white/5 mt-10">
        <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Supported agents</h2>
            <p className="text-[#666] text-sm md:text-base leading-relaxed mb-16 max-w-3xl mx-auto font-medium">
                We provide a wide range of agents on the market specifically to make your shopping as easy as
                possible, Thanks to this broad integration, you can use our tool regardless of which trusted
                intermediary you are currently using. Our main goal is to streamline and accelerate your entire
                purchasing process
            </p>
            
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 select-none">
                 {/* KakoBuy - Red */}
                 <div className="text-2xl font-bold text-red-600 tracking-tighter hover:opacity-80 cursor-pointer transition-opacity">
                    KakoBuy
                 </div>
                 
                 {/* JoyaGoo - Yellow/Green */}
                 <div className="text-2xl font-bold flex items-center hover:opacity-80 cursor-pointer transition-opacity">
                    <span className="text-yellow-400">Joya</span><span className="text-lime-400">Goo</span>
                 </div>

                 {/* cn-fans - Red/Gray */}
                 <div className="text-2xl font-bold text-[#888] hover:text-white transition-colors cursor-pointer">
                    <span className="text-red-600">cn</span>·fans
                 </div>

                 {/* USFans - Orange/Blue */}
                 <div className="text-2xl font-bold text-orange-500 hover:opacity-80 cursor-pointer transition-opacity">
                    US<span className="text-blue-500">Fans</span>
                 </div>
                 
                 {/* SUGARGOO - Gray/Orange */}
                 <div className="text-xl font-bold text-zinc-600 uppercase tracking-widest hover:opacity-80 cursor-pointer transition-opacity">
                    SUGAR<span className="text-orange-500">GOO</span>
                 </div>

                 {/* OrientDig - Orange Italic */}
                 <div className="text-2xl font-bold text-orange-400 italic font-serif hover:opacity-80 cursor-pointer transition-opacity">
                    OrientDig
                 </div>

                 {/* LitBuy - Purple */}
                 <div className="text-2xl font-bold text-purple-500 hover:opacity-80 cursor-pointer transition-opacity">
                    LitBuy
                 </div>

                 {/* Copbuy - Pink */}
                 <div className="text-2xl font-bold text-pink-600 hover:opacity-80 cursor-pointer transition-opacity">
                    Copbuy
                 </div>
                 
                 {/* Mulebuy - Orange */}
                 <div className="text-2xl font-bold text-orange-600 hover:opacity-80 cursor-pointer transition-opacity">
                    Mulebuy
                 </div>
            </div>
        </div>
    </div>
);

const Footer = () => (
  <footer className="w-full bg-[#050505] pt-24 pb-12 border-t border-white/5">
    <div className="max-w-[1200px] mx-auto px-6 md:px-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
        {/* Product */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-white text-sm uppercase tracking-widest mb-2">PRODUCT</h3>
          {['Home', 'Pricing', 'Careers', 'Changelog'].map(item => (
             <Link key={item} to="#" className="text-[#666] hover:text-white text-sm font-medium transition-colors">{item}</Link>
          ))}
        </div>

        {/* Company */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-white text-sm uppercase tracking-widest mb-2">COMPANY</h3>
           {['Docs', 'Blog', '404', 'Waitlist'].map(item => (
             <Link key={item} to="#" className="text-[#666] hover:text-white text-sm font-medium transition-colors">{item}</Link>
          ))}
        </div>

        {/* Resources */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-white text-sm uppercase tracking-widest mb-2">RESOURCES</h3>
          {['Legal', 'Docs single', 'Blog single', 'Career single'].map(item => (
             <Link key={item} to="#" className="text-[#666] hover:text-white text-sm font-medium transition-colors">{item}</Link>
          ))}
        </div>

        {/* Social */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-white text-sm uppercase tracking-widest mb-2">SOCIAL</h3>
          <a href="#" className="flex items-center gap-3 text-[#666] hover:text-white text-sm font-medium transition-colors">
            <Github size={18} /> Github
          </a>
          <a href="#" className="flex items-center gap-3 text-[#666] hover:text-white text-sm font-medium transition-colors">
            <Linkedin size={18} /> LinkedIn
          </a>
          <a href="#" className="flex items-center gap-3 text-[#666] hover:text-white text-sm font-medium transition-colors">
            <Twitter size={18} /> Twitter/ X
          </a>
          <a href="#" className="flex items-center gap-3 text-[#666] hover:text-white text-sm font-medium transition-colors">
            <Gamepad2 size={18} /> Discord
          </a>
        </div>
      </div>
      
      <div className="mt-16 pt-8 border-t border-white/5 flex flex-col items-center">
         <p className="text-[#666] text-sm font-medium">
            Made with ❤️ by <a href="http://www.devbucks.net/" target="_blank" rel="noreferrer" className="text-white hover:text-primary transition-colors font-bold">DevBucks</a>
         </p>
      </div>
    </div>
  </footer>
);

// --- Main Page Component ---

export const Home: React.FC = () => {
  const location = useLocation();

  // Handle auto-scrolling
  useEffect(() => {
    // Priority 1: State scrollTo (from other pages)
    if (location.state && location.state.scrollTo) {
        const sectionId = location.state.scrollTo;
        const element = document.getElementById(sectionId);
        setTimeout(() => {
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    } 
    // Priority 2: Products Subpage Route
    else if (location.pathname === '/products') {
        const element = document.getElementById('products-section');
        setTimeout(() => {
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-0">
      
      {/* HERO SECTION */}
      <div id="hero-section" className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-8 relative">
        
        {/* Text Content */}
        <div className="space-y-8 relative z-10 order-2 lg:order-1 pt-8 lg:pt-0">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white leading-[1.1] animate-fade-in-up">
                Any <span className="text-primary">Reps</span>
            </h1>
            <p className="text-white text-lg md:text-xl max-w-md leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                Clear stress free tools for your china tour. Track convert, and discover all in one sleek workspace
            </p>
            
            <div className="pt-4 flex flex-col items-start">
                <Link to="/calculator" className="inline-block bg-primary hover:bg-primaryHover text-black font-bold text-base px-8 py-4 rounded-xl transition-transform hover:scale-105 animate-fade-in-up mb-4" style={{ animationDelay: '0.15s' }}>
                    Explore tools
                </Link>
                
                {/* Tool Widget */}
                <HeroToolWidget />
            </div>
        </div>

        {/* Snake Image */}
        <div className="relative h-[500px] lg:h-[700px] flex items-center justify-center order-1 lg:order-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                 <img 
                    src="https://i.pinimg.com/originals/bc/eb/c0/bcebc0cd047847abbe15a92ae801bff8.png"
                    alt="AnyReps Snake Visual" 
                    className="w-auto h-auto max-w-full max-h-full object-contain drop-shadow-[0_0_50px_rgba(21,128,61,0.2)]"
                />
            </div>
            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-primary/10 blur-[120px] rounded-full z-0 opacity-50"></div>
        </div>
      </div>

      {/* BRAND LIST */}
      <BrandList />

      {/* LATEST PRODUCTS SECTION */}
      <div id="products-section" className="max-w-[1400px] mx-auto px-6 md:px-12 mt-4">
        <h2 className="text-3xl font-bold text-white text-center mb-10">Latest products</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProductCard 
                title="Airforce | x Drake nocta"
                brand="Nike"
                price={35}
                image="https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:111111,w_600,h_600/global/392328/01/sv01/fnd/EEA/fmt/png/PUMA-Smash-3.0-L-Sneakers"
                to="/search"
            />
            <ProductCard 
                title="Airforce | x Drake nocta"
                brand="Nike"
                price={35}
                image="https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:111111,w_600,h_600/global/392328/01/sv01/fnd/EEA/fmt/png/PUMA-Smash-3.0-L-Sneakers"
                to="/search"
            />
        </div>

        {/* IMP THREAD Footer Section */}
        <div className="mt-20 text-center space-y-3">
            <p className="text-[#444] text-xs font-mono font-bold uppercase tracking-widest">IMP THREAD</p>
            <p className="text-white text-lg font-medium max-w-lg mx-auto">
                All of these things are delivered on time and from the best sources
            </p>
        </div>
      </div>

      {/* TOOLS SECTION */}
      <ToolsSection />
      
      {/* SUPPORTED AGENTS */}
      <SupportedAgents />
      
      {/* TESTIMONIALS SECTION */}
      <TestimonialsSection />

      {/* FOOTER */}
      <Footer />

    </div>
  );
};
