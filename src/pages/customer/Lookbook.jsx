import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, MapPin } from 'lucide-react';
import { cn } from '../../lib/utils';

const Lookbook = () => {
  const stories = [
    {
      id: 1,
      title: "The Sanganeri Soul",
      category: "Heritage",
      desc: "A profound exploration into the 500-year-old art of wooden block printing, preserved by generations of artisans in the heart of Jaipur.",
      image: "https://images.unsplash.com/photo-1610136649349-0f646f318053?q=80&w=2070&auto=format&fit=crop",
      offset: false
    },
    {
      id: 2,
      title: "Royal Silk Silhouettes",
      category: "Festive",
      desc: "Structural grace meets fluid drapes. Capturing the regal essence of Jaipuri silks against the architectural marvels of the Pink City.",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1974&auto=format&fit=crop",
      offset: true
    },
    {
      id: 3,
      title: "Cotton Comforts",
      category: "Summer",
      desc: "Breathable, organic cottons designed for modern living, inspired by the sun-drenched courtyards and serene havelis of Rajasthan.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop",
      offset: false
    },
    {
      id: 4,
      title: "Indigo Impressions",
      category: "Craft",
      desc: "Diving deep into the world of natural indigos and dabu resists, where every pattern tells a story of patience and precision.",
      image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1972&auto=format&fit=crop",
      offset: true
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24 space-y-4"
        >
          <div className="flex items-center justify-center gap-2 text-primary">
             <Sparkles size={16} />
             <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Editorial Journey</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-heading font-bold text-foreground tracking-tight leading-tight uppercase">
            Curated <br />
            <span className="italic font-light text-primary">Masterpieces.</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base font-medium leading-relaxed">
            A visual narrative of heritage, craftsmanship, and the timeless elegance of BadriBhai Apparels.
          </p>
        </motion.div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
          {stories.map((story) => (
            <motion.div 
              key={story.id}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className={cn(
                "group relative",
                story.offset ? 'md:mt-24' : ''
              )}
            >
              <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-muted relative shadow-xl border border-border">
                 <img 
                   src={story.image} 
                   alt={story.title} 
                   className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                 
                 <div className="absolute top-6 left-6 flex items-center gap-2 bg-background/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                    <MapPin size={12} className="text-white" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white">Pink City, Jaipur</span>
                 </div>
              </div>
  
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-[2px] bg-primary" />
                   <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{story.category}</p>
                </div>
                <h3 className="text-3xl font-heading font-bold text-foreground group-hover:text-primary transition-colors uppercase tracking-tight">{story.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-md">{story.desc}</p>
                
                <button className="text-[10px] font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors flex items-center gap-2 pt-2">
                   Explore Story <Star size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
  
        {/* Footer Editorial Quote */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-40 text-center py-24 border-y border-border relative overflow-hidden"
        >
           <div className="absolute top-0 left-0 w-full h-full bg-muted/30 -z-10" />
           <Star size={32} className="mx-auto mb-8 text-primary opacity-20" />
           <p className="text-3xl md:text-5xl font-heading font-bold text-foreground max-w-3xl mx-auto leading-tight uppercase tracking-tighter">
             "Preserving the <span className="text-primary">Soul</span> of the past, <br className="hidden md:block" /> dressing the <span className="italic font-light">Grace</span> of the future."
           </p>
           <p className="text-[10px] font-bold uppercase tracking-[0.6em] text-primary mt-10">— Artisanal Philosophy</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Lookbook;
