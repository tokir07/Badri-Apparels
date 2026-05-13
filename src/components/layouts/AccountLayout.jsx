import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Package, MapPin, CreditCard, Bell, Settings, 
  ChevronRight, LogOut, ShieldCheck, Zap, Star, Sparkles,
  Heart
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { cn } from '../../lib/utils';

const AccountLayout = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const menuItems = [
    { label: 'Profile', icon: <User size={20} />, path: '/profile' },
    { label: 'Orders', icon: <Package size={20} />, path: '/profile/orders' },
    { label: 'Wishlist', icon: <Heart size={20} />, path: '/wishlist' },
    { label: 'Addresses', icon: <MapPin size={20} />, path: '/profile/addresses' },
    { label: 'Notifications', icon: <Bell size={20} />, path: '/profile/notifications' },
    { label: 'Settings', icon: <Settings size={20} />, path: '/profile/settings' },
  ];

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-black pt-40 pb-24 px-6 md:px-12">
      <div className="container mx-auto max-w-7xl">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar - Desktop */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="hidden lg:block lg:col-span-3 space-y-8"
          >
            {/* Patron Summary Card */}
            <div className="bg-white/70 dark:bg-white/[0.02] backdrop-blur-xl border border-accent-gold/10 p-10 rounded-[3rem] shadow-[0_8px_32px_rgba(0,0,0,0.03)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-accent-maroon to-[#600000] flex items-center justify-center text-white text-3xl font-heading font-bold shadow-2xl shadow-accent-maroon/20 mb-6 overflow-hidden border-4 border-white">
                   {user?.profileImage ? (
                     <img src={user.profileImage} alt="Patron" className="w-full h-full object-cover" />
                   ) : (
                     <>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</>
                   )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                   <Sparkles size={14} className="text-accent-gold" />
                   <h3 className="text-2xl font-heading font-bold text-text-primary tracking-tight">{user?.firstName} {user?.lastName}</h3>
                </div>
                <p className="text-[9px] text-accent-gold font-bold uppercase tracking-[0.4em] mt-1 border border-accent-gold/20 px-3 py-1 rounded-full bg-accent-gold/5">Verified Patron</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-4">
              {menuItems.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <Link 
                    key={item.label}
                    to={item.path}
                    className={`flex items-center justify-between p-6 rounded-2xl transition-all duration-700 group backdrop-blur-md border ${
                      isActive 
                        ? 'bg-accent-maroon text-white border-accent-maroon shadow-2xl shadow-accent-maroon/20 scale-[1.02]' 
                        : 'bg-white/40 dark:bg-white/[0.02] border-accent-gold/10 text-text-secondary hover:border-accent-gold/40 hover:bg-white/60'
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "transition-all duration-500",
                        isActive ? 'text-accent-gold scale-110' : 'text-accent-gold/40 group-hover:text-accent-gold group-hover:scale-110'
                      )}>
                        {item.icon}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{item.label}</span>
                    </div>
                    {isActive && (
                      <motion.div 
                        layoutId="activeDot" 
                        className="w-1.5 h-1.5 rounded-full bg-accent-gold shadow-[0_0_8px_rgba(212,175,55,1)]" 
                      />
                    )}
                  </Link>
                );
              })}
              
              <button 
                onClick={logout}
                className="w-full flex items-center justify-between p-6 rounded-2xl text-text-secondary bg-white/20 border border-accent-gold/10 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 transition-all duration-500 group mt-10"
              >
                <div className="flex items-center gap-5">
                   <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                   <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Sign Out</span>
                </div>
                <ChevronRight size={14} className="opacity-20 group-hover:opacity-100 transition-opacity" />
              </button>
            </nav>
          </motion.div>

          {/* Main Content Area */}
          <motion.div 
            key={currentPath}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="col-span-1 lg:col-span-9"
          >
            <div className="bg-white border border-accent-gold/10 rounded-[3.5rem] p-8 md:p-16 min-h-[70vh] shadow-sm relative overflow-hidden">
               {/* Decorative Background Motif */}
               <div className="absolute top-0 right-0 p-12 text-accent-gold/5 pointer-events-none">
                  <Sparkles size={200} strokeWidth={0.5} />
               </div>
               <Outlet />
            </div>
          </motion.div>

        </div>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50 bg-white/90 backdrop-blur-xl border border-accent-gold/10 rounded-full px-8 py-4 flex justify-between items-center shadow-2xl">
          {menuItems.slice(0, 4).map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link 
                key={item.label}
                to={item.path}
                className={`p-3 rounded-full transition-all duration-500 ${
                  isActive ? 'bg-accent-maroon text-white shadow-xl' : 'text-text-secondary'
                }`}
              >
                {item.icon}
              </Link>
            );
          })}
          <Link 
            to="/profile/settings"
            className={`p-3 rounded-full transition-all duration-500 ${
              currentPath === '/profile/settings' ? 'bg-accent-maroon text-white shadow-xl' : 'text-text-secondary'
            }`}
          >
            <Settings size={20} />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AccountLayout;
