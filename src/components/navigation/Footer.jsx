import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Sparkles, Camera, Globe, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';
import { authService } from '../../services/authService';

const Footer = () => {
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (!email) return;

    setSubmitting(true);
    try {
      const res = await authService.subscribeNewsletter(email);
      if (res.success) {
        toast.success("Welcome to the Collective", { 
          description: "You have been enrolled in our heritage dispatches." 
        });
        e.target.reset();
      } else {
        toast.error(res.message || "Subscription failed");
      }
    } catch (error) {
      toast.error("Failed to connect to the heritage archive");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-card border-t border-border pt-24 pb-12 overflow-hidden relative mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-12 mb-20">
          
          {/* Brand & Newsletter */}
          <div className="md:col-span-5 space-y-10">
            <div className="space-y-6">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                     <Sparkles size={16} className="text-primary-foreground" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Jaipur Heritage</span>
               </div>
               <h2 className="text-4xl font-heading font-bold text-foreground tracking-tighter">
                  BADRIBHAI <span className="italic font-light text-primary">APPAREL</span>
               </h2>
               <p className="text-muted-foreground text-sm max-w-sm leading-relaxed font-light italic">
                  "Preserving the legacy of Jaipur's handcrafted textile traditions for the modern, graceful woman."
               </p>
            </div>

            <div className="space-y-6 pt-4">
               <p className="text-xs font-bold uppercase tracking-widest text-foreground">Subscribe to our Newsletter</p>
               <form 
                 onSubmit={handleSubscribe}
                 className="relative max-w-md group"
               >
                  <input 
                    name="email"
                    type="email" 
                    required
                    disabled={submitting}
                    placeholder="ENTER YOUR EMAIL ADDRESS" 
                    className="w-full bg-transparent border-b border-border py-4 text-xs tracking-widest focus:outline-none focus:border-primary transition-colors text-foreground placeholder:text-muted-foreground/40 font-bold uppercase"
                  />
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors"
                  >
                    {submitting ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={20} />}
                  </button>
               </form>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block md:col-span-1"></div>

          {/* Links - Curation */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-10 text-muted-foreground">Collections</h4>
            <ul className="space-y-5">
              {[
                { name: 'Jaipuri Kurtis', path: '/collections/kurties' },
                { name: 'Festive Wear', path: '/collections' },
                { name: 'New Arrivals', path: '/products' },
                { name: 'The Lookbook', path: '/lookbook' },
                { name: 'Gift Cards', path: '#' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group w-fit">
                    <span className="w-0 h-[1px] bg-primary group-hover:w-3 transition-all duration-300"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links - Concierge */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-10 text-muted-foreground">Client Care</h4>
            <ul className="space-y-5">
              {[
                { name: 'Track Order', path: '/track/ORD-123' },
                { name: 'Shipping Policy', path: '#' },
                { name: 'Return Policy', path: '#' },
                { name: 'Terms of Service', path: '#' },
                { name: 'Privacy Policy', path: '#' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group w-fit">
                    <span className="w-0 h-[1px] bg-primary group-hover:w-3 transition-all duration-300"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4 text-muted-foreground">
             <MapPin size={14} className="text-primary" />
             <p className="text-[10px] font-bold uppercase tracking-[0.3em]">
                Jaipur, Rajasthan &nbsp; • &nbsp; Established 2026
             </p>
          </div>
          
          <div className="flex gap-10">
            <a href="#" className="flex items-center gap-2 text-[10px] text-muted-foreground hover:text-primary transition-all font-bold tracking-[0.3em] uppercase group">
              <Camera size={14} /> Instagram
            </a>
            <a href="#" className="flex items-center gap-2 text-[10px] text-muted-foreground hover:text-primary transition-all font-bold tracking-[0.3em] uppercase group">
              <Globe size={14} /> Twitter
            </a>
          </div>
        </div>

        <div className="mt-16 text-center border-t border-border/50 pt-10">
           <p className="text-[9px] text-muted-foreground/30 tracking-[1em] uppercase font-bold">
              © 2026 BADRIBHAI APPAREL &nbsp; • &nbsp; Artisanally Crafted
           </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
