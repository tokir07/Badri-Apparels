import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, 
  BarChart3, Settings, LogOut, Menu, X, Bell, 
  Search, ChevronRight, Sparkles, Command, 
  Moon, Sun, Globe, Zap, CreditCard, Ticket, Plus,
  Star, Heart, Palette, Layers
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Inventory', path: '/admin/inventory', icon: <Layers size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Coupons', path: '/admin/coupons', icon: <Ticket size={20} /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-background text-foreground font-body overflow-hidden selection:bg-primary/30">
      
      {/* Background Cinematic Elements - Modern Luxury Heritage */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-primary/[0.02] rounded-full blur-[180px]" />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[40]"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
       <motion.aside
        initial={false}
        animate={{ 
          width: isSidebarOpen ? (isMobile ? '100%' : 300) : (isMobile ? 0 : 90),
          x: isMobile && !isSidebarOpen ? -300 : 0
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`h-full fixed lg:relative z-[50] flex flex-col bg-background/80 backdrop-blur-md border-r border-border overflow-hidden ${isMobile && !isSidebarOpen ? 'pointer-events-none' : ''}`}
      >
        {/* Sidebar Header */}
        <div className="h-24 flex items-center px-8 justify-between shrink-0 border-b border-border">
          <AnimatePresence mode="wait">
            {(isSidebarOpen || isMobile) && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center rotate-12 shadow-xl shadow-primary/20">
                  <Sparkles size={20} className="text-primary-foreground -rotate-12" />
                </div>
                <div>
                  <h1 className="font-heading font-bold text-xl tracking-tighter leading-none">BADRI</h1>
                  <p className="text-[9px] font-bold tracking-[0.3em] text-accent uppercase mt-1">Institutional Panel</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {!isMobile && (
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
            >
              <Menu size={18} className={isSidebarOpen ? 'rotate-90 transition-transform' : 'transition-transform'} />
            </button>
          )}
          {isMobile && (
            <button onClick={() => setIsSidebarOpen(false)} className="text-primary hover:rotate-90 transition-transform">
              <X size={24} />
            </button>
          )}
        </div>
 
        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-8 space-y-3 overflow-y-auto custom-scrollbar" data-lenis-prevent>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => isMobile && setIsSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-5 px-6 py-4 rounded-2xl transition-all duration-500 relative group
                  ${isActive 
                    ? 'text-primary bg-primary/5 shadow-inner' 
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/5'}
                `}
              >
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/4 bottom-1/4 w-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(128,0,0,0.3)]"
                  />
                )}
                <div className={`transition-all duration-500 ${isActive ? 'text-primary scale-110' : 'group-hover:scale-110 group-hover:text-primary'}`}>
                  {item.icon}
                </div>
                <AnimatePresence mode="wait">
                  {(isSidebarOpen || isMobile) && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -10 }}
                      className="text-[11px] font-bold uppercase tracking-[0.2em] whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
                {item.name === 'Orders' && (
                  <div className="ml-auto w-6 h-6 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-primary-foreground shadow-lg">
                    3
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer - Profile Section */}
        <div className="p-6 mt-auto border-t border-border shrink-0 bg-background/50">
          <div className={`flex items-center gap-4 p-4 rounded-[1.5rem] bg-primary/5 border border-primary/10 transition-all ${!isSidebarOpen && !isMobile ? 'justify-center' : ''}`}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-accent p-[1px] shrink-0">
               <div className="w-full h-full bg-background rounded-xl flex items-center justify-center overflow-hidden">
                  <img src="https://ui-avatars.com/api/?name=Badri+Admin&background=800000&color=fff" alt="Admin" className="w-full h-full object-cover" />
               </div>
            </div>
            {(isSidebarOpen || isMobile) && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-primary truncate">Master Artisan</p>
                <p className="text-[9px] text-muted-foreground truncate uppercase tracking-widest opacity-60">Curator Panel</p>
              </div>
            )}
            {(isSidebarOpen || isMobile) && (
              <button onClick={handleLogout} className="text-muted-foreground hover:text-red-600 transition-colors">
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative z-10 overflow-hidden">
        
        {/* Top Navbar */}
        <header 
          className={`h-24 flex items-center justify-between px-8 md:px-12 transition-all duration-500 z-[45] ${
            scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border' : 'bg-transparent'
          }`}
        >
          {/* Mobile Menu Button */}
          {isMobile && (
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-3 bg-background border border-border rounded-xl mr-4 shadow-sm"
            >
              <Menu size={20} className="text-primary" />
            </button>
          )}

          {/* Breadcrumbs / Page Context */}
          <div className="hidden md:flex items-center gap-4">
             <div className="flex items-center gap-2 text-muted-foreground/40">
                <Command size={14} />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Institutional</span>
             </div>
             <ChevronRight size={14} className="text-accent/20" />
             <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
               {navItems.find(i => location.pathname === i.path || location.pathname.startsWith(i.path))?.name || 'Overview'}
             </span>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-4 md:gap-8 flex-1 justify-end">
            {/* Search Bar - Cinematic */}
            <div className="relative group hidden sm:block max-w-md w-full ml-8">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search heritage assets, acquisitions..." 
                className="w-full bg-background border border-border rounded-2xl py-3.5 pl-12 pr-4 text-xs text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary transition-all duration-500 shadow-sm"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 rounded border border-border text-[9px] font-bold text-accent uppercase tracking-tighter">
                Ctrl + K
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button className="p-3.5 bg-background border border-border rounded-xl text-primary hover:bg-primary hover:text-primary-foreground transition-all relative shadow-sm">
                <Bell size={20} />
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-accent rounded-full border-2 border-background"></span>
              </button>
              <button className="p-3.5 bg-background border border-border rounded-xl text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-sm">
                <Zap size={20} />
              </button>
            </div>

            {/* Profile Dropdown Placeholder */}
            <div className="w-12 h-12 rounded-2xl bg-background border border-border p-1 cursor-pointer group hover:border-primary transition-all duration-500 shadow-sm">
               <div className="w-full h-full bg-primary/5 rounded-xl flex items-center justify-center">
                  <Palette size={20} className="text-primary" />
               </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto px-8 md:px-12 pb-12 custom-scrollbar relative" data-lenis-prevent>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[1600px] mx-auto pt-4 relative"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>

        </main>
      </div>

      {/* Global CSS for custom scrollbar (Internal to this file for now) */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #C2B280;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #800000;
        }
      `}} />
    </div>
  );
};

export default AdminLayout;
