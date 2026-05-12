import React from 'react';
import { 
  Download, Calendar, ChevronDown, ArrowUpRight, 
  BarChart3, PieChart, TrendingUp, Globe,
  ArrowRight, Search, Filter, Sparkles, Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const AdminAnalytics = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  const handleExport = () => {
    toast.promise(new Promise(resolve => setTimeout(resolve, 2500)), {
      loading: 'Extracting institutional dataset...',
      success: 'Dataset exported to secure archive',
      error: 'Extraction failure'
    });
  };

  const handleRangeSelect = () => {
    toast.info("Temporal Range Selector: Curation cycle selection pending institutional gateway");
  };

   return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-12"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between md:items-end gap-10 border-b border-border pb-12">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="w-10 h-[1px] bg-accent" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent">Heritage Metrics</span>
           </div>
           <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter text-foreground">
             Institutional <span className="italic font-light text-primary">Analytics.</span>
           </h1>
           <p className="text-muted-foreground text-sm font-medium opacity-80 leading-relaxed max-w-md">Quantifying the impact of Jaipuri craftsmanship on global patrons with real-time cultural intelligence.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleRangeSelect}
            className="flex items-center gap-4 px-8 py-5 text-[10px] font-bold uppercase tracking-widest bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary rounded-2xl transition-all shadow-sm group"
          >
            <Calendar size={18} className="text-accent group-hover:text-primary transition-colors" /> Last 30 Heritage Days <ChevronDown size={14} />
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-4 bg-primary text-primary-foreground px-10 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary/10"
          >
            <Download size={18} /> Export Dataset
          </button>
        </div>
      </motion.div>
 
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Sales Over Time cinematic line chart */}
        <motion.div variants={itemVariants} className="bg-background/60 backdrop-blur-md border border-border rounded-[3.5rem] p-12 relative overflow-hidden shadow-sm hover:border-primary/20 transition-all">
          <div className="absolute top-0 right-0 p-12 text-primary/5 pointer-events-none">
             <Sparkles size={150} strokeWidth={0.5} />
          </div>
          <div className="flex justify-between items-start mb-16 relative z-10">
            <div className="space-y-1">
              <h2 className="text-4xl font-heading font-bold text-foreground">Institutional Velocity</h2>
              <div className="flex items-end gap-6 mt-8">
                 <p className="text-6xl font-heading font-bold text-foreground tracking-tighter">₹8.42 Cr</p>
                 <span className="text-[11px] text-green-700 font-bold mb-3 flex items-center gap-2 bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20 backdrop-blur-md">
                    <ArrowUpRight size={16} /> +14.2%
                 </span>
              </div>
            </div>
            <div className="p-5 bg-primary/10 rounded-2xl text-primary">
               <TrendingUp size={28} />
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-1 relative z-10">
            <div className="w-full h-full relative">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4A0404" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#4A0404" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path 
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  d="M0,80 Q10,60 20,70 T40,40 T60,60 T80,20 T100,10" 
                  fill="none" 
                  stroke="#4A0404" 
                  strokeWidth="2" 
                  vectorEffect="non-scaling-stroke" 
                />
                <motion.path 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                  d="M0,80 Q10,60 20,70 T40,40 T60,60 T80,20 T100,10 L100,100 L0,100 Z" 
                  fill="url(#revenueGradient)" 
                />
              </svg>
            </div>
          </div>
          <div className="flex justify-between mt-10 px-4 text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/40 italic">
             <span>Heritage Day 01</span>
             <span>Mid Cycle</span>
             <span>Current Epoch</span>
          </div>
        </motion.div>
 
        {/* Traffic Sources cinematic bars */}
        <motion.div variants={itemVariants} className="bg-background/60 backdrop-blur-md border border-border rounded-[3.5rem] p-12 shadow-sm relative overflow-hidden hover:border-primary/20 transition-all">
           <div className="flex items-center justify-between mb-16">
              <div className="space-y-1">
                 <h2 className="text-4xl font-heading font-bold text-foreground">Patron <span className="text-primary italic font-light">Origins.</span></h2>
                 <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.3em] italic opacity-40">Acquisition channel breakdown</p>
              </div>
              <div className="p-5 bg-accent/10 rounded-2xl text-accent">
                 <PieChart size={28} />
              </div>
           </div>
           <div className="space-y-10 relative z-10">
            {[
              { source: 'Institutional Search', percent: 45, color: 'bg-primary', icon: <Globe size={18} /> },
              { source: 'Heritage Circles', percent: 30, color: 'bg-accent', icon: <Sparkles size={18} /> },
              { source: 'Artisanal Referrals', percent: 15, color: 'bg-primary/60', icon: <Search size={18} /> },
              { source: 'Direct Access', percent: 10, color: 'bg-accent/60', icon: <Star size={18} /> }
            ].map((item, idx) => (
              <div key={item.source} className="group cursor-default">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-5">
                     <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-700">
                        {item.icon}
                     </div>
                     <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{item.source}</span>
                  </div>
                  <span className="text-xl font-bold text-foreground tracking-tighter font-heading">{item.percent}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.percent}%` }}
                    transition={{ duration: 1.5, delay: 0.5 + idx * 0.1, ease: "easeOut" }}
                    className={`h-full ${item.color} rounded-full shadow-lg`} 
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
 
        {/* Top Products cinematic table */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-background/60 backdrop-blur-md border border-border rounded-[3.5rem] p-12 shadow-sm relative overflow-hidden hover:border-primary/20 transition-all">
          <div className="flex justify-between items-center mb-16">
             <div className="space-y-2">
                <h2 className="text-4xl font-heading font-bold text-foreground">Masterpiece <span className="text-primary italic font-light">Performance.</span></h2>
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-bold italic opacity-40">Heritage asset efficiency by revenue contribution</p>
             </div>
             <button 
                onClick={() => toast.info("Deep Intelligence Protocol: Analyzing historical performance cycles")}
                className="flex items-center gap-4 px-10 py-5 text-[10px] font-bold uppercase tracking-widest border border-border bg-background rounded-2xl hover:border-primary hover:text-primary transition-all shadow-sm"
              >
                Full Collection Intelligence <ArrowRight size={20} />
             </button>
          </div>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-muted border-b border-border text-muted-foreground/40">
                <tr>
                  <th className="px-8 py-8 font-bold text-[10px] uppercase tracking-[0.3em]">Heritage Asset</th>
                  <th className="px-8 py-8 font-bold text-[10px] uppercase tracking-[0.3em] text-center">Volume Sold</th>
                  <th className="px-8 py-8 font-bold text-[10px] uppercase tracking-[0.3em] text-center">Artisanal Index</th>
                  <th className="px-8 py-8 font-bold text-[10px] uppercase tracking-[0.3em] text-right">Net Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { name: 'Mughal Block Print Kurti', img: '/images/block_print_collection_1778263468000_1778264691387.png', sold: 452, efficiency: '96%', revenue: '₹45,19,548' },
                  { name: 'Royal Maroon Anarkali Set', img: '/images/festive_ethnic_wear_1778263491000_1778264709002.png', sold: 124, efficiency: '92%', revenue: '₹23,55,876' }
                ].map((product, idx) => (
                  <tr key={idx} className="group hover:bg-primary/[0.02] transition-colors">
                    <td className="px-8 py-10 flex items-center gap-10">
                      <div className="w-20 h-24 bg-muted border border-border rounded-2xl overflow-hidden group-hover:scale-110 transition-transform duration-1000 shadow-sm">
                        <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-heading font-bold text-2xl text-foreground group-hover:text-primary transition-colors tracking-tight">{product.name}</span>
                    </td>
                    <td className="px-8 py-10 text-center">
                       <span className="text-xl font-bold text-muted-foreground/60 italic font-heading">{product.sold}</span>
                    </td>
                    <td className="px-8 py-10 text-center">
                       <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-green-500/10 text-green-700 border border-green-500/20 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                          {product.efficiency} Precision
                       </div>
                    </td>
                    <td className="px-8 py-10 text-right">
                       <span className="text-2xl font-heading font-bold text-primary">{product.revenue}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
 
      </div>
    </motion.div>
  );
};

export default AdminAnalytics;
