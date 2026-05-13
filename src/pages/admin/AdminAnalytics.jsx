import React, { useState, useEffect } from 'react';
import { 
  Download, Calendar, ChevronDown, ArrowUpRight, 
  BarChart3, PieChart, TrendingUp, Globe,
  ArrowRight, Search, Filter, Sparkles, Star, Archive,
  Loader2, Activity, DollarSign, ShoppingBag, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar,
  PieChart as RechartsPie, Pie, Cell
} from 'recharts';
import { adminService } from '../../services/adminService';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboardSummary(timeRange);
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      toast.error("Failed to synchronize analytical dataset");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const handleExport = () => {
    toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
      loading: 'Extracting high-fidelity dataset...',
      success: 'Dataset exported to secure archive',
      error: 'Extraction failure'
    });
  };

  if (loading && !data) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-16 h-16 text-accent-gold animate-spin opacity-20" />
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold animate-pulse">Processing Institutional Data...</p>
      </div>
    );
  }

  const COLORS = ['#800000', '#D4AF37', '#4A0404', '#C2B280'];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 pb-20"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-10 border-b border-accent-gold/10 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-[1px] bg-accent-gold" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">Institutional Intelligence</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter">
            Market <span className="italic font-light text-accent-maroon">Analytics.</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium opacity-80 leading-relaxed max-w-md">Real-time quantification of artisanal demand and patron acquisition velocity across global corridors.</p>
        </div>
        <div className="flex gap-4">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white border border-accent-gold/10 px-8 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest outline-none focus:border-accent-maroon transition-all shadow-sm"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter</option>
            <option value="1y">Yearly Anthology</option>
          </select>
          <button 
            onClick={handleExport}
            className="flex items-center gap-4 bg-accent-maroon text-white px-10 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-accent-maroon/20"
          >
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      {/* Primary Revenue Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-white border border-accent-gold/10 rounded-[3.5rem] p-12 shadow-sm relative overflow-hidden">
           <div className="flex justify-between items-start mb-16">
              <div className="space-y-2">
                 <h2 className="text-2xl font-heading font-bold text-text-primary">Revenue Velocity</h2>
                 <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent-gold">Artisanal performance over {timeRange}</p>
              </div>
              <div className="text-right">
                 <p className="text-4xl font-heading font-bold text-accent-maroon tracking-tighter">₹{(data?.totalRevenue || 0).toLocaleString()}</p>
                 <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest mt-2 flex items-center justify-end gap-2">
                    <TrendingUp size={14} /> +14.2% Growth
                 </p>
              </div>
           </div>

           <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={data?.revenueTrend || []}>
                    <defs>
                       <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#800000" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#800000" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis 
                       dataKey="date" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{fontSize: 9, fontWeight: 700, fill: '#9CA3AF'}} 
                       dy={10}
                    />
                    <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{fontSize: 9, fontWeight: 700, fill: '#9CA3AF'}} 
                       tickFormatter={(v) => `₹${v/1000}k`}
                    />
                    <Tooltip 
                       content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                             return (
                                <div className="bg-white/95 backdrop-blur-xl border border-accent-gold/20 p-4 rounded-2xl shadow-2xl">
                                   <p className="text-[10px] font-bold text-accent-maroon mb-1">REVENUE</p>
                                   <p className="text-xl font-heading font-bold">₹{payload[0].value.toLocaleString()}</p>
                                </div>
                             );
                          }
                          return null;
                       }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#800000" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Channel Distribution */}
        <div className="lg:col-span-4 bg-white border border-accent-gold/10 rounded-[3.5rem] p-12 shadow-sm flex flex-col justify-between">
           <h3 className="text-xl font-heading font-bold mb-10">Patron Segments</h3>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <RechartsPie>
                    <Pie
                       data={[
                          { name: 'Platinum', value: 35 },
                          { name: 'Gold', value: 45 },
                          { name: 'Initiate', value: 20 }
                       ]}
                       innerRadius={80}
                       outerRadius={100}
                       paddingAngle={10}
                       dataKey="value"
                    >
                       {[0, 1, 2].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                    </Pie>
                    <Tooltip />
                 </RechartsPie>
              </ResponsiveContainer>
           </div>
           <div className="space-y-4">
              {['Platinum Patrons', 'Gold Patrons', 'Artisan Initiates'].map((tier, i) => (
                 <div key={tier} className="flex justify-between items-center p-4 bg-accent-gold/5 rounded-2xl border border-accent-gold/10">
                    <div className="flex items-center gap-3">
                       <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                       <span className="text-[10px] font-bold uppercase tracking-widest">{tier}</span>
                    </div>
                    <span className="text-xs font-bold">{[35, 45, 20][i]}%</span>
                 </div>
              ))}
           </div>
        </div>
      </div>

      {/* Top Product Showcase */}
      <div className="bg-[#0A0A0A] text-white rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-accent-maroon/10 rounded-full blur-[100px]" />
         <div className="relative z-10">
            <div className="flex justify-between items-center mb-16">
               <div className="space-y-2">
                  <h2 className="text-3xl font-heading font-bold">Masterpiece Rankings</h2>
                  <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-accent-gold">High-Velocity Collection Assets</p>
               </div>
               <div className="flex gap-4">
                  <div className="text-right">
                     <p className="text-[9px] font-bold uppercase tracking-widest text-accent-gold opacity-60">Avg. Basket Value</p>
                     <p className="text-2xl font-heading font-bold">₹4,250</p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {(data?.topProducts || []).slice(0, 3).map((product, i) => (
                  <div key={i} className="group bg-white/5 border border-white/10 rounded-[2.5rem] p-8 hover:border-accent-gold/40 transition-all cursor-pointer">
                     <div className="relative mb-8">
                        <div className="aspect-[4/5] rounded-[2rem] overflow-hidden">
                           <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                        </div>
                        <div className="absolute top-4 left-4 bg-accent-gold text-white w-10 h-10 rounded-xl flex items-center justify-center font-heading font-bold shadow-xl">
                           0{i + 1}
                        </div>
                     </div>
                     <div className="space-y-4">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.2em]">{product.title}</h4>
                        <div className="flex justify-between items-end border-t border-white/10 pt-6">
                           <div>
                              <p className="text-[8px] font-bold uppercase text-accent-gold mb-1">Revenue Generated</p>
                              <p className="text-xl font-bold">₹{product.revenue.toLocaleString()}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[8px] font-bold uppercase text-accent-gold mb-1">Units Sold</p>
                              <p className="text-xs font-bold text-white/60">{product.unitsSold} Pieces</p>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </motion.div>
  );
};

export default AdminAnalytics;
