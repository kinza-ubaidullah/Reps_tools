
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, User as UserIcon, X, Shield, LogOut } from 'lucide-react';
import { User, Rank } from '../../types';

interface NavbarProps {
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLoginClick, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero-section');
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation Links Configuration
  const navLinks = [
    { label: 'Home', id: 'hero-section', path: '/' },
    { label: 'Tools', id: 'tools-section', paths: ['/calculator', '/converter', '/search', '/tracking', '/qc'] },
    { label: 'Products', id: 'products-section', path: '/products' },
    { label: 'Community', id: 'community-section', paths: ['/community', '/sellers', '/wishlist'] },
  ];

  // Handle active state based on Route or Scroll
  useEffect(() => {
    // 1. If we are NOT on the home page (or on the products subpage), set active based on URL path
    if (location.pathname !== '/') {
      const currentPath = location.pathname;
      const matchingLink = navLinks.find(link => 
        (link.path === currentPath) ||
        (link.paths && link.paths.some(p => currentPath.startsWith(p)))
      );
      if (matchingLink) {
        setActiveSection(matchingLink.id);
      } else {
        setActiveSection(''); 
      }
      return; 
    }

    // 2. If we ARE on the home page, set active based on Scroll Position
    const handleScroll = () => {
      const sections = navLinks.map(link => link.id);
      
      // Default to Hero if at top
      if (window.scrollY < 100) {
        setActiveSection('hero-section');
        return;
      }

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Check if the top of the section is within the viewport or close to it
          if (rect.top >= -100 && rect.top < window.innerHeight / 2) {
             setActiveSection(sectionId);
             break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleNavClick = (link: typeof navLinks[0]) => {
    setIsMobileMenuOpen(false); // Close mobile menu

    // If it's a direct route link (like /products)
    if (link.path && link.path !== '/') {
        navigate(link.path);
        return;
    }

    // Default Anchor Logic (Home sections)
    if (location.pathname !== '/') {
      navigate('/');
      // Timeout to allow navigation to complete before scrolling
      setTimeout(() => {
        scrollToSection(link.id);
      }, 100);
    } else {
      scrollToSection(link.id);
    }
  };

  const scrollToSection = (id: string) => {
    if (id === 'hero-section') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setActiveSection(id);
  };

  return (
    <>
    <header className="h-24 flex items-center justify-between px-6 md:px-12 w-full fixed top-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-md border-b border-white/5 transition-all duration-300">
      {/* Left: Mobile Menu Toggle & Logo */}
      <div className="flex items-center gap-4 z-50">
        <button 
            onClick={() => setIsMobileMenuOpen(true)} 
            className="lg:hidden p-2 text-gray-400 mr-2 hover:text-white transition-colors"
        >
          <Menu size={28} />
        </button>

        <Link to="/" onClick={() => window.scrollTo(0,0)} className="flex items-center gap-4 group">
           {/* Logo Graphic */}
           <div className="w-12 h-12 relative flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-105 transition-transform">
                <path d="M20 28H80" stroke="#B91C1C" strokeWidth="8" strokeLinecap="round"/>
                <path d="M35 28L25 85" stroke="#B91C1C" strokeWidth="8" strokeLinecap="round"/>
                <path d="M65 28L75 85" stroke="#B91C1C" strokeWidth="8" strokeLinecap="round"/>
                <path d="M30 55H70" stroke="#B91C1C" strokeWidth="8" strokeLinecap="round"/>
                <path d="M72 18C78 18 82 22 78 30C74 38 65 42 50 42" stroke="#15803D" strokeWidth="6" strokeLinecap="round"/>
                <path d="M50 42C35 42 22 46 22 56C22 66 32 72 50 72" stroke="#15803D" strokeWidth="6" strokeLinecap="round"/>
                <path d="M50 72C68 72 74 82 70 92" stroke="#15803D" strokeWidth="6" strokeLinecap="round"/>
                <circle cx="75" cy="20" r="2" fill="#EAB308" />
              </svg>
           </div>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-2 bg-white/5 px-2 py-2 rounded-full border border-white/5 backdrop-blur-sm shadow-lg shadow-black/20">
        {navLinks.map((link) => (
            <button
                key={link.label}
                onClick={() => handleNavClick(link)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  activeSection === link.id 
                    ? 'bg-white/10 text-white shadow-inner' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
                {link.label}
            </button>
        ))}
      </nav>

      {/* Right Side - Login/Profile/Logout */}
      <div className="flex items-center gap-4 z-50">
        {/* Admin Access Button (Desktop) */}
        {user?.rank === Rank.ADMIN && (
          <Link to="/admin" className="hidden md:flex items-center gap-2 px-3 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-xs font-bold hover:bg-red-500 hover:text-white transition-colors">
            <Shield size={16} /> Admin
          </Link>
        )}

        {user ? (
           <div className="flex items-center gap-3">
               <Link to="/profile" className="flex items-center gap-3 bg-[#1A1A1A] hover:bg-[#252525] pl-3 pr-4 py-2 rounded-full border border-white/10 transition-all hover:border-primary/30 group">
                  <div className="w-8 h-8 rounded-full bg-gray-800 overflow-hidden ring-2 ring-transparent group-hover:ring-primary/50 transition-all">
                      {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="avatar"/> : <div className="w-full h-full flex items-center justify-center"><UserIcon size={16} /></div>}
                  </div>
                  <span className="text-sm font-medium hidden md:block group-hover:text-primary transition-colors">{user.username}</span>
               </Link>
               <button 
                onClick={onLogout} 
                className="w-10 h-10 rounded-full bg-[#1A1A1A] hover:bg-red-500/10 border border-white/10 flex items-center justify-center text-[#666] hover:text-red-500 transition-colors"
                title="Logout"
               >
                 <LogOut size={18} />
               </button>
           </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="px-6 py-3 bg-[#111] hover:bg-[#222] text-white text-sm font-bold rounded-full border border-white/10 transition-all hover:border-primary/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
          >
            Login
          </button>
        )}
      </div>
    </header>

    {/* Mobile Full Screen Menu Overlay */}
    {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#050505] flex flex-col animate-fade-in-up">
            {/* Mobile Header */}
            <div className="h-24 px-6 flex items-center justify-between border-b border-white/5">
                 <div className="flex items-center gap-4">
                     <button onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-gray-300 transition-colors">
                        <X size={32} />
                     </button>
                     {/* Logo Copy */}
                     <div className="w-10 h-10 relative flex items-center justify-center">
                        <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 28H80" stroke="#B91C1C" strokeWidth="8" strokeLinecap="round"/>
                            <path d="M35 28L25 85" stroke="#B91C1C" strokeWidth="8" strokeLinecap="round"/>
                            <path d="M65 28L75 85" stroke="#B91C1C" strokeWidth="8" strokeLinecap="round"/>
                            <path d="M30 55H70" stroke="#B91C1C" strokeWidth="8" strokeLinecap="round"/>
                            <path d="M72 18C78 18 82 22 78 30C74 38 65 42 50 42" stroke="#15803D" strokeWidth="6" strokeLinecap="round"/>
                            <path d="M50 42C35 42 22 46 22 56C22 66 32 72 50 72" stroke="#15803D" strokeWidth="6" strokeLinecap="round"/>
                            <path d="M50 72C68 72 74 82 70 92" stroke="#15803D" strokeWidth="6" strokeLinecap="round"/>
                            <circle cx="75" cy="20" r="2" fill="#EAB308" />
                        </svg>
                     </div>
                 </div>
                 
                 {/* Mobile Profile Avatar */}
                 {user && (
                     <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden ring-2 ring-white/10">
                         {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="avatar"/> : <div className="w-full h-full flex items-center justify-center"><UserIcon size={20} /></div>}
                     </Link>
                 )}
            </div>

            {/* Links */}
            <div className="flex-1 flex flex-col items-center justify-center gap-10">
                {navLinks.map((link) => (
                    <button
                        key={link.label}
                        onClick={() => handleNavClick(link)}
                        className={`text-4xl font-bold transition-all duration-300 ${
                          activeSection === link.id ? 'text-primary scale-110' : 'text-white hover:text-gray-300'
                        }`}
                    >
                        {link.label}
                    </button>
                ))}
            </div>

            {/* Bottom Links */}
            <div className="pb-16 flex flex-col items-center gap-6 text-[#666] font-medium">
                 <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white transition-colors">My Profile</Link>
                 <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white transition-colors">Wishlist</Link>
                 {user?.rank === Rank.ADMIN && (
                   <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-red-500 font-bold flex items-center gap-2">
                     <Shield size={16} /> Admin Panel
                   </Link>
                 )}
                 {user && (
                    <button onClick={() => { onLogout(); setIsMobileMenuOpen(false); }} className="text-red-500 font-bold flex items-center gap-2 mt-2">
                        <LogOut size={16} /> Logout
                    </button>
                 )}
            </div>
        </div>
    )}
    </>
  );
};
