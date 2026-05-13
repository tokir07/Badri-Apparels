import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingCart, Users, Settings, 
  Layers, ShieldCheck, Truck, BarChart3, 
  LogOut, ChevronRight, Menu, X, Bell, Search,
  Command, UserCircle, HelpCircle, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import { cn } from '../../lib/utils';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={22} /> },
    { name: 'Products', path: '/admin/products', icon: <Layers size={22} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart size={22} /> },
    { name: 'Customers', path: '/admin/users', icon: <Users size={22} /> },
    { name: 'Inventory', path: '/admin/inventory', icon: <Layers size={22} /> },
    { name: 'Staff', path: '/admin/staff', icon: <ShieldCheck size={22} /> },
    { name: 'Logistics', path: '/admin/logistics', icon: <Truck size={22} /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={22} /> },
    { name: 'Broadcast', path: '/admin/notifications', icon: <Bell size={22} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={22} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex overflow-hidden font-sans">
      {/* Desktop Vertical Sidebar */}
      <aside 
        className={cn(
          "hidden lg:flex flex-col bg-white border-r border-accent-gold/10 transition-all duration-500 ease-in-out relative z-50",
          isSidebarOpen ? "w-72" : "w-24"
        )}
      >
        {/* Logo Section */}
        <div className="h-24 flex items-center px-8 border-b border-accent-gold/5">
           <div className={cn("flex items-center gap-4 transition-all duration-500", !isSidebarOpen && "opacity-0 w-0 overflow-hidden")}>
              <div className="w-10 h-10 bg-accent-maroon rounded-xl flex items-center justify-center text-white shadow-xl shadow-accent-maroon/20 shrink-0">
                 <Command size={22} />
              </div>
              <div className="whitespace-nowrap">
                 <h1 className="text-sm font-heading font-bold tracking-tight text-text-primary uppercase">BadriBhai</h1>
                 <p className="text-[9px] font-bold text-accent-gold uppercase tracking-[0.2em]">Command Center</p>
              </div>
           </div>
           {!isSidebarOpen && (
              <div className="w-full flex justify-center">
                 <div className="w-10 h-10 bg-accent-maroon rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent-maroon/20 shrink-0">
                    <Command size={22} />
                 </div>
              </div>
           )}
        </div>

        {/* Sidebar Navigation Items */}
        <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative",
                  isActive 
                    ? "bg-accent-maroon text-white shadow-xl shadow-accent-maroon/15" 
                    : "text-muted-foreground hover:bg-accent-gold/5 hover:text-accent-maroon"
                )}
              >
                <div className={cn("transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")}>
                  {item.icon}
                </div>
                {isSidebarOpen && (
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
                    {item.name}
                  </span>
                )}
                {isActive && (
                   <motion.div 
                     layoutId="sidebar-active-indicator"
                     className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-accent-gold rounded-full"
                   />
                )}
                {item.name === 'Orders' && (
                   <span className={cn(
                      "absolute top-4 right-4 w-5 h-5 bg-accent-maroon text-white text-[8px] flex items-center justify-center rounded-full border-2 border-white font-bold",
                      isActive ? "bg-accent-gold" : "bg-accent-maroon",
                      !isSidebarOpen && "top-2 right-2 w-4 h-4 text-[7px]"
                   )}>3</span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-accent-gold/10">
           <button 
             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
             className="w-full flex items-center justify-center p-3 mb-4 bg-accent-gold/5 rounded-xl text-accent-gold hover:bg-accent-maroon hover:text-white transition-all shadow-sm"
           >
              {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
           </button>
           <button 
             onClick={handleLogout}
             className={cn(
               "w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all group",
               !isSidebarOpen && "justify-center"
             )}
           >
             <LogOut size={22} className="group-hover:rotate-12 transition-transform" />
             {isSidebarOpen && <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Logout</span>}
           </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Page Top Header */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-accent-gold/10 flex items-center justify-between px-10 shrink-0 sticky top-0 z-40">
           <div className="flex items-center gap-6">
              <div className="relative group">
                 <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-gold/60" />
                 <input 
                    type="text" 
                    placeholder="Search global anthology..." 
                    className="bg-accent-gold/5 border border-accent-gold/10 rounded-2xl py-3 pl-12 pr-6 text-xs w-80 focus:outline-none focus:border-accent-maroon/30 focus:w-96 transition-all"
                 />
              </div>
              <div className="h-8 w-[1px] bg-accent-gold/20" />
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-accent-gold opacity-50">Admin</span>
                 <ChevronRight size={14} className="text-accent-gold opacity-30" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-accent-maroon">
                    {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
                 </span>
              </div>
           </div>

           <div className="flex items-center gap-8">
              <div className="flex items-center gap-4">
                 <button className="p-3 text-accent-gold hover:bg-accent-gold/5 rounded-xl transition-all relative">
                    <Bell size={20} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent-maroon rounded-full border-2 border-white" />
                 </button>
                 <button className="p-3 text-accent-gold hover:bg-accent-gold/5 rounded-xl transition-all">
                    <HelpCircle size={20} />
                 </button>
              </div>
              <div className="h-8 w-[1px] bg-accent-gold/20" />
              <div className="flex items-center gap-4">
                 <div className="text-right">
                    <p className="text-[11px] font-bold text-text-primary uppercase">{user?.firstName || 'Badri Admin'}</p>
                    <p className="text-[8px] text-accent-gold font-bold uppercase tracking-widest">Master Curator</p>
                 </div>
                 <div className="w-12 h-12 bg-accent-maroon rounded-2xl p-0.5 shadow-lg shadow-accent-maroon/20">
                    <div className="w-full h-full bg-white rounded-[0.9rem] flex items-center justify-center text-accent-maroon font-heading font-bold text-xl">
                       {user?.firstName?.[0] || 'B'}
                    </div>
                 </div>
              </div>
           </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto bg-[#FDFCFB] relative">
           <div className="p-12 pb-32 min-h-full relative">
              {/* Cinematic Background Gradients */}
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-gold/5 rounded-full blur-[150px] -z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-maroon/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
              
              <div className="max-w-[1600px] mx-auto">
                 <AnimatePresence mode="wait">
                   <motion.div
                     key={location.pathname}
                     initial={{ opacity: 0, y: 15 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -15 }}
                     transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                   >
                     <Outlet />
                   </motion.div>
                 </AnimatePresence>
              </div>
           </div>
        </div>
      </main>

      {/* Mobile Toggle & Menu - Hidden on Desktop */}
      <button 
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed bottom-10 right-10 z-[60] w-16 h-16 bg-accent-maroon text-white rounded-full shadow-2xl flex items-center justify-center shadow-accent-maroon/30"
      >
        <Menu size={28} />
      </button>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md lg:hidden p-6"
          >
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="bg-white rounded-[3rem] w-full h-full p-10 flex flex-col"
             >
                <div className="flex justify-between items-center mb-12">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-accent-maroon rounded-xl flex items-center justify-center text-white">
                         <Command size={20} />
                      </div>
                      <h2 className="font-heading font-bold text-xl uppercase tracking-tighter">BadriBhai</h2>
                   </div>
                   <button onClick={() => setIsMobileMenuOpen(false)} className="p-4 bg-accent-gold/10 rounded-2xl text-accent-gold">
                      <X size={24} />
                   </button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
                   {navItems.map((item) => (
                      <NavLink
                         key={item.name}
                         to={item.path}
                         onClick={() => setIsMobileMenuOpen(false)}
                         className={cn(
                            "flex items-center justify-between p-6 rounded-3xl transition-all",
                            location.pathname === item.path ? "bg-accent-maroon text-white shadow-xl shadow-accent-maroon/20" : "bg-accent-gold/5 text-text-primary"
                         )}
                      >
                         <div className="flex items-center gap-6">
                            {item.icon}
                            <span className="text-sm font-bold uppercase tracking-widest">{item.name}</span>
                         </div>
                         <ChevronRight size={18} />
                      </NavLink>
                   ))}
                </div>
                <button 
                  onClick={handleLogout}
                  className="mt-8 flex items-center justify-center gap-4 p-6 bg-red-50 text-red-500 rounded-3xl text-sm font-bold uppercase tracking-widest"
                >
                   <LogOut size={22} /> Relinquish Access
                </button>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLayout;
