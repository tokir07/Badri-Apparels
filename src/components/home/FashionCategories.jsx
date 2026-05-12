import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ArrowUpRight } from 'lucide-react';

const FashionCategories = () => {
  const [hoveredPanel, setHoveredPanel] = useState(null);

  const menTags = ['Streetwear', 'Oversized Fits', 'Denim', 'Essentials', 'Sneakers', 'Formal Wear'];
  const womenTags = ['Dresses', 'Co-ords', 'Ethnic Wear', 'Casual Fits', 'Luxury Bags', 'Footwear'];

  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-1/2 h-1/2 bg-accent-gold blur-[150px] mix-blend-multiply rounded-full"
        />
      </div>

      {/* Header Area */}
      <div className="container mx-auto px-6 md:px-12 mb-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-4"
            >
              <Sparkles size={16} className="text-accent-gold" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent-gold">Style Without Limits</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-heading font-bold text-text-primary mb-4"
            >
              Discover Your Fashion <span className="italic font-light text-text-secondary">Identity</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-text-secondary text-lg"
            >
              Immerse yourself in our distinct collections. From oversized architectural streetwear to fluid luxury silhouettes.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex-shrink-0"
          >
            <Link to="/collections" className="group flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-text-primary">
              <span className="relative">
                Explore All Categories
                <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-text-primary transform origin-right scale-x-0 group-hover:scale-x-100 group-hover:origin-left transition-transform duration-500"></span>
              </span>
              <div className="w-10 h-10 rounded-full border border-text-primary/20 flex items-center justify-center group-hover:bg-text-primary group-hover:text-primary transition-all duration-300 shadow-xl">
                <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Split Accordion Layout */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full h-[80vh] md:h-[90vh] flex flex-col md:flex-row relative group/container px-4 md:px-8 gap-4 md:gap-8"
      >
        
        {/* Men's Panel */}
        <div 
          className={`relative overflow-hidden rounded-[2rem] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-2xl flex-1 ${
            hoveredPanel === 'men' ? 'md:flex-[1.6]' : hoveredPanel === 'women' ? 'md:flex-[0.6]' : 'md:flex-1'
          }`}
          onMouseEnter={() => setHoveredPanel('men')}
          onMouseLeave={() => setHoveredPanel(null)}
        >
          <img 
            src="/images/mens_collection_1778255762220.png" 
            alt="Mens Fashion" 
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ${
              hoveredPanel === 'men' ? 'scale-105 filter grayscale-0' : 'scale-100 filter grayscale-[20%]'
            }`}
          />
          <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-700 ${
            hoveredPanel === 'men' ? 'from-black/90 via-black/30 to-transparent' : 'from-black/70 via-black/40 to-black/20'
          }`}></div>

          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 z-10">
            <div className={`transition-all duration-700 transform ${hoveredPanel === 'men' ? 'translate-y-0' : 'translate-y-8'}`}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-[1px] bg-accent-gold"></div>
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent-gold">Menswear</span>
              </div>
              
              <h3 className="text-white text-5xl md:text-7xl font-heading font-bold uppercase tracking-tight mb-6">Men</h3>
              
              {/* Category Chips - Only fully visible on hover */}
              <div className={`flex flex-wrap gap-2 mb-8 transition-all duration-700 max-w-lg ${
                hoveredPanel === 'men' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 md:hidden'
              }`}>
                {menTags.map((tag) => (
                  <Link key={tag} to={`/collections?category=${tag.toLowerCase()}`} className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-text-primary hover:scale-105 transition-all duration-300">
                    {tag}
                  </Link>
                ))}
              </div>

              <Link to="/collections?category=men" className={`group/btn relative inline-flex items-center justify-center px-8 py-4 bg-white text-text-primary overflow-hidden transition-all duration-500 rounded-full hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] ${
                hoveredPanel === 'men' ? 'opacity-100' : 'opacity-80'
              }`}>
                <span className="absolute inset-0 w-full h-full bg-accent-gold transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 ease-out"></span>
                <span className="relative z-10 flex items-center gap-3 text-xs uppercase tracking-widest font-bold group-hover/btn:text-primary transition-colors duration-300">
                  Shop Men <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
          
          {/* Hover Glow Border */}
          <div className={`absolute inset-0 rounded-[2rem] border border-white/0 pointer-events-none transition-all duration-700 ${hoveredPanel === 'men' ? 'border-white/30 shadow-[inset_0_0_100px_rgba(255,255,255,0.1)]' : ''}`}></div>
        </div>

        {/* VS Divider Badge */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none hidden md:flex items-center justify-center">
          <motion.div 
            animate={{ rotate: hoveredPanel === 'men' ? -15 : hoveredPanel === 'women' ? 15 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="bg-primary/80 backdrop-blur-xl border border-border-light text-text-primary rounded-full w-20 h-20 flex items-center justify-center font-heading italic text-xl shadow-2xl"
          >
            VS
          </motion.div>
        </div>

        {/* Women's Panel */}
        <div 
          className={`relative overflow-hidden rounded-[2rem] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-2xl flex-1 ${
            hoveredPanel === 'women' ? 'md:flex-[1.6]' : hoveredPanel === 'men' ? 'md:flex-[0.6]' : 'md:flex-1'
          }`}
          onMouseEnter={() => setHoveredPanel('women')}
          onMouseLeave={() => setHoveredPanel(null)}
        >
          <img 
            src="/images/womens_collection_1778255789605.png" 
            alt="Womens Fashion" 
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ${
              hoveredPanel === 'women' ? 'scale-105 filter grayscale-0' : 'scale-100 filter grayscale-[20%]'
            }`}
          />
          <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-700 ${
            hoveredPanel === 'women' ? 'from-black/90 via-black/30 to-transparent' : 'from-black/70 via-black/40 to-black/20'
          }`}></div>

          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 z-10">
            <div className={`transition-all duration-700 transform ${hoveredPanel === 'women' ? 'translate-y-0' : 'translate-y-8'}`}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-[1px] bg-accent-peach"></div>
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent-peach">Womenswear</span>
              </div>
              
              <h3 className="text-white text-5xl md:text-7xl font-heading font-bold uppercase tracking-tight mb-6">Women</h3>
              
              {/* Category Chips - Only fully visible on hover */}
              <div className={`flex flex-wrap gap-2 mb-8 transition-all duration-700 max-w-lg ${
                hoveredPanel === 'women' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 md:hidden'
              }`}>
                {womenTags.map((tag) => (
                  <Link key={tag} to={`/collections?category=${tag.toLowerCase()}`} className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-text-primary hover:scale-105 transition-all duration-300">
                    {tag}
                  </Link>
                ))}
              </div>

              <Link to="/collections?category=women" className={`group/btn relative inline-flex items-center justify-center px-8 py-4 bg-white text-text-primary overflow-hidden transition-all duration-500 rounded-full hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] ${
                hoveredPanel === 'women' ? 'opacity-100' : 'opacity-80'
              }`}>
                <span className="absolute inset-0 w-full h-full bg-accent-peach transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 ease-out"></span>
                <span className="relative z-10 flex items-center gap-3 text-xs uppercase tracking-widest font-bold group-hover/btn:text-primary transition-colors duration-300">
                  Shop Women <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
          
          {/* Hover Glow Border */}
          <div className={`absolute inset-0 rounded-[2rem] border border-white/0 pointer-events-none transition-all duration-700 ${hoveredPanel === 'women' ? 'border-white/30 shadow-[inset_0_0_100px_rgba(255,255,255,0.1)]' : ''}`}></div>
        </div>

      </motion.div>
    </section>
  );
};

export default FashionCategories;
