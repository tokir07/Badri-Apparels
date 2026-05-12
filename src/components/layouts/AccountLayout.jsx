import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Package, MapPin, CreditCard, Bell, Settings, 
  ChevronRight, LogOut, ShieldCheck, Zap, Star, Sparkles,
  Heart
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

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
    <div className="min-h-screen bg-primary pt-40 pb-24 px-6 md:px-12">
      <div className="container mx-auto max-w-7xl">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar - Desktop */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="hidden lg:block lg:col-span-3 space-y-8"
          >
            {/* Patron Summary Card */}
            <div className="bg-white border border-accent-gold/10 p-8 rounded-[3rem] shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-accent-maroon flex items-center justify-center text-white text-2xl font-heading font-bold shadow-xl mb-4">
                   {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </div>
                <div className="flex items-center gap-2 mb-1">
                   <Sparkles size={12} className="text-accent-gold" />
                   <h3 className="text-xl font-heading font-bold text-text-primary">{user?.firstName} {user?.lastName}</h3>
                </div>
                <p className="text-[10px] text-text-secondary font-bold uppercase tracking-[0.2em] mt-1">Verified Patron</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-3">
              {menuItems.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <Link 
                    key={item.label}
                    to={item.path}
                    className={`flex items-center justify-between p-5 rounded-2xl transition-all duration-500 group ${
                      isActive 
                        ? 'bg-accent-maroon text-white shadow-2xl shadow-accent-maroon/20' 
                        : 'bg-white border border-accent-gold/5 text-text-secondary hover:border-accent-maroon hover:text-accent-maroon'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={isActive ? 'text-accent-gold' : 'group-hover:text-accent-gold transition-colors'}>
                        {item.icon}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                    </div>
                    {isActive && <motion.div layoutId="activeDot" className="w-1.5 h-1.5 rounded-full bg-accent-gold" />}
                  </Link>
                );
              })}
              
              <button 
                onClick={logout}
                className="w-full flex items-center gap-4 p-5 rounded-2xl text-red-500 bg-white border border-red-100 hover:bg-red-50 transition-all duration-300 group mt-8"
              >
                <LogOut size={20} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Sign Out</span>
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
