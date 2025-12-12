
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Calculator, 
  Link, 
  Search, 
  Truck, 
  Camera, 
  Flame, 
  ShoppingBag, 
  FileSpreadsheet, 
  Users, 
  Home,
  Heart,
  X,
  Shield
} from 'lucide-react';
import { User, Rank } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  close: () => void;
  user?: User | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, close, user }) => {
  const links = [
    { to: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { type: 'category', label: 'TOOLS' },
    { to: '/calculator', icon: <Calculator size={20} />, label: 'Shipping Calc' },
    { to: '/converter', icon: <Link size={20} />, label: 'Link Converter' },
    { to: '/search', icon: <Search size={20} />, label: 'Search Engine' },
    { to: '/tracking', icon: <Truck size={20} />, label: 'Tracking' },
    { to: '/qc', icon: <Camera size={20} />, label: 'QC Photos' },
    { type: 'category', label: 'COMMUNITY' },
    { to: '/community/hot', icon: <Flame size={20} />, label: 'Hot Selling' },
    { to: '/community/w2c', icon: <ShoppingBag size={20} />, label: 'W2C Finds' },
    { to: '/community/sheets', icon: <FileSpreadsheet size={20} />, label: 'Spreadsheets' },
    { to: '/sellers', icon: <Users size={20} />, label: 'Trusted Sellers' },
    { type: 'category', label: 'PERSONAL' },
    { to: '/wishlist', icon: <Heart size={20} />, label: 'My Wishlist' },
  ];

  if (user?.rank === Rank.ADMIN) {
    links.splice(1, 0, { to: '/admin', icon: <Shield size={20} className="text-red-500" />, label: 'Admin Panel' });
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden" onClick={close}></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:relative z-50 w-64 h-full bg-darker transform transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 flex justify-between items-center md:hidden">
            <span className="font-bold text-lg text-white">Menu</span>
            <button onClick={close} className="text-zinc-400 hover:text-white"><X size={24} /></button>
        </div>

        <nav className="px-4 py-6 space-y-1 overflow-y-auto h-full pb-20 no-scrollbar">
          {links.map((link, idx) => {
            if (link.type === 'category') {
              return (
                <div key={idx} className="pt-6 pb-3 px-3 text-[11px] font-extrabold text-zinc-500 uppercase tracking-widest font-sans">
                  {link.label}
                </div>
              );
            }
            return (
              <NavLink
                key={idx}
                to={link.to!}
                onClick={() => { if(window.innerWidth < 768) close() }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-surface text-white shadow-lg shadow-black/40 border border-white/5'
                      : 'text-zinc-400 hover:bg-surface/50 hover:text-zinc-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`transition-colors ${
                       isActive ? 'text-primary' : (link.label === 'Admin Panel' ? 'text-red-500' : 'text-zinc-500 group-hover:text-zinc-300')
                    }`}>
                      {link.icon}
                    </span>
                    <span className={link.label === 'Admin Panel' ? 'text-red-400 font-bold' : ''}>
                      {link.label}
                    </span>
                    
                    {/* Active Indicator Dot */}
                    {isActive && (
                       <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
