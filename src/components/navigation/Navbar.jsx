import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Heart, ShoppingBag, User, Menu, X, 
  LogOut, UserCircle, Sparkles, ArrowRight
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import SearchOverlay from './SearchOverlay';
import BrandLogo from '../common/BrandLogo';
import { cn } from '../../lib/utils';
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, role, logout, loading } = useAuthStore();
  const { setIsOpen, items } = useCartStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collections', path: '/collections' },
    { name: 'Jaipuri Kurties', path: '/collections/kurties' },
    { name: 'New Arrivals', path: '/products' },
    { name: 'Lookbook', path: '/lookbook' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const [activeMegaMenu, setActiveMegaMenu] = useState(null);

  const kurtiCategories = [
    { name: 'Anarkali Silhouettes', path: '/collections/kurties?style=Anarkali', desc: 'Royal flares for grand occasions' },
    { name: 'Artisanal Block Prints', path: '/collections/kurties?style=Block Print', desc: 'Hand-stamped heritage' },
    { name: 'Chanderi Grace', path: '/collections/kurties?style=Chanderi', desc: 'Ethereal silk blends' },
    { name: 'Straight Cut Classics', path: '/collections/kurties?style=Straight', desc: 'Timeless everyday elegance' },
  ];

  return (
    <>
      <nav 
        onMouseLeave={() => setActiveMegaMenu(null)}
        className={cn(
          "fixed top-0 left-0 w-full z-[100] transition-all duration-500 px-4 md:px-8",
          isScrolled ? "py-2" : "py-4"
        )}
      >
        <div className={cn(
          "max-w-7xl mx-auto flex items-center justify-between px-6 transition-all duration-500 rounded-2xl border",
          isScrolled 
            ? "h-14 bg-background/80 backdrop-blur-md border-border shadow-sm" 
            : "h-16 bg-background/40 backdrop-blur-sm border-transparent"
        )}>
          
          {/* LEFT: Brand Logo */}
          <div className="flex-1 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                 <BrandLogo className="w-8 h-8" color="currentColor" />
              </div>
              <div className="hidden sm:block">
                 <h1 className="text-sm font-heading font-bold tracking-tighter text-foreground whitespace-nowrap">
                    BADRIBHAI <span className="italic font-light text-accent">APPAREL</span>
                 </h1>
              </div>
            </Link>
          </div>

          {/* CENTER: Navigation Links */}
          <div className="hidden lg:flex items-center justify-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const hasMegaMenu = link.name === 'Jaipuri Kurtis';

              return (
                <div 
                  key={link.name}
                  onMouseEnter={() => hasMegaMenu && setActiveMegaMenu(link.name)}
                  className="relative h-full flex items-center"
                >
                  <Link 
                    to={link.path}
                    className="relative px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-foreground/70 transition-all group"
                  >
                    <span className={cn(
                      "relative z-10 transition-colors",
                      isActive ? "text-primary" : "group-hover:text-primary"
                    )}>
                      {link.name}
                    </span>
                    
                    {isActive && (
                      <motion.div 
                        layoutId="nav-active"
                        className="absolute bottom-1 left-4 right-4 h-[2px] bg-primary rounded-full"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                </div>
              );
            })}
          </div>

          {/* MEGA MENU OVERLAY */}
          <AnimatePresence>
            {activeMegaMenu === 'Jaipuri Kurtis' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-[calc(100%+8px)] left-0 w-full bg-background/95 backdrop-blur-xl border border-border rounded-3xl shadow-2xl overflow-hidden z-[110] p-8"
              >
                <div className="max-w-6xl mx-auto grid grid-cols-12 gap-12">
                  {/* Category Grid */}
                  <div className="col-span-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-[1px] bg-primary/30" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-primary">Jaipuri Anthology</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8">
                      {kurtiCategories.map((cat, i) => (
                        <Link 
                          key={cat.name} 
                          to={cat.path}
                          onClick={() => setActiveMegaMenu(null)}
                          className="group space-y-2 p-4 rounded-2xl hover:bg-muted transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors">{cat.name}</h3>
                            <ArrowRight size={16} className="text-primary opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                          </div>
                          <p className="text-xs text-muted-foreground font-light leading-relaxed">{cat.desc}</p>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Featured Artwork */}
                  <div className="col-span-4">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group/img">
                      <img 
                        src="/jaipuri_kurti_collection_1778493244855.png" 
                        alt="Featured Collection" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6 space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-accent-gold">Seasonal Highlight</p>
                        <h4 className="text-xl font-heading font-bold text-white leading-tight">Hand-Blocked <br/>Maroon Anarkali</h4>
                        <Link to="/products" onClick={() => setActiveMegaMenu(null)} className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/70 hover:text-white transition-colors">
                          Shop Now <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* RIGHT: Actions */}
          <div className="flex-1 flex items-center justify-end space-x-1 md:space-x-3">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-foreground/70 hover:text-primary transition-all"
            >
              <Search size={16} />
            </button>
            
            <Link to="/wishlist" className="hidden md:flex p-2 text-foreground/70 hover:text-primary transition-all">
              <Heart size={16} />
            </Link>

            <button 
              onClick={() => setIsOpen(true)}
              className="p-2 text-foreground/70 hover:text-primary transition-all relative group"
            >
              <ShoppingBag size={16} />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-primary text-primary-foreground text-[7px] font-bold flex items-center justify-center rounded-full border-2 border-background">
                  {itemCount}
                </span>
              )}
            </button>
            
            {!loading && (
              <div className="flex items-center gap-2">
                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                     <div className="h-4 w-[1px] bg-border mx-1" />
                     <Link 
                       to={role === 'admin' ? "/admin" : "/profile"} 
                       className="p-2 bg-muted text-foreground rounded-lg hover:bg-primary hover:text-primary-foreground transition-all"
                     >
                        <UserCircle size={16} />
                     </Link>
                     <button onClick={handleLogout} className="hidden md:flex p-2 text-muted-foreground hover:text-destructive transition-colors">
                        <LogOut size={14} />
                     </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 md:gap-3">
                    <div className="h-4 w-[1px] bg-border mx-1 hidden md:block" />
                    <Link 
                      to="/login" 
                      className="text-[10px] font-bold uppercase tracking-widest text-foreground/70 hover:text-primary transition-all px-2 md:px-0"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/signup" 
                      className="hidden md:flex px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-[9px] font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-md"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="lg:hidden p-2 text-foreground bg-muted rounded-lg"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-background"
          >
            <div className="container mx-auto px-6 h-full flex flex-col">
              <div className="h-20 flex items-center justify-between border-b border-border">
                 <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
                    <BrandLogo className="w-8 h-8 text-primary" color="currentColor" />
                    <h2 className="text-lg font-heading font-bold">BADRIBHAI APPAREL</h2>
                 </Link>
                 <button 
                   onClick={() => setIsMobileMenuOpen(false)} 
                   className="p-3 bg-primary text-primary-foreground rounded-lg"
                 >
                    <X size={20} />
                 </button>
              </div>
              
              <div className="flex-1 flex flex-col justify-center space-y-6">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link 
                      to={link.path} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="group flex items-center justify-between"
                    >
                      <span className="text-2xl font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                        {link.name}
                      </span>
                      <ArrowRight size={20} className="text-primary opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  </motion.div>
                ))}

                {!isAuthenticated && (
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="pt-8 flex flex-col gap-4"
                  >
                    <Link 
                      to="/login" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full py-4 border border-border text-foreground rounded-xl text-xs font-bold uppercase tracking-widest text-center"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/signup" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full py-4 bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-widest text-center shadow-lg"
                    >
                      Sign Up
                    </Link>
                  </motion.div>
                )}
              </div>

              <div className="py-8 border-t border-border flex flex-col gap-4">
                 <div className="space-y-1">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-accent">Customer Support</p>
                    <p className="text-xs font-bold text-foreground underline">support@badriapparel.com</p>
                 </div>
                 <div className="flex gap-6">
                    {['Instagram', 'Pinterest'].map(social => (
                      <a key={social} href="#" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{social}</a>
                    ))}
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
};

export default Navbar;
