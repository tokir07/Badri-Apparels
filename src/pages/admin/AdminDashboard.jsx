import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Users, ShoppingBag, DollarSign,
  ArrowUpRight, ArrowDownRight, Clock, AlertCircle,
  ChevronRight, Calendar, Filter, Download,
  Activity, ArrowRight, MousePointer2, Sparkles,
  ShieldCheck, Star, Loader2, X, Package, ExternalLink
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { adminService } from '../../services/adminService';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('Last 30 Days');

  const fetchSummary = async () => {
    try {
      const response = await adminService.getDashboardSummary({ range: dateRange });
      if (response.success) {
        setSummary(response.data);
      }
    } catch (error) {
      toast.error("Institutional archive synchronization failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    const interval = setInterval(fetchSummary, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [dateRange]);

  if (loading && !summary) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-accent-gold animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">Synchronizing Archive...</p>
      </div>
    );
  }

  const stats = [
    {
      title: "Today's Revenue",
      value: `₹${(summary?.todayRevenue || 0).toLocaleString()}`,
      icon: <DollarSign size={20} />,
      color: "bg-accent-maroon",
      trend: "+12.5%"
    },
    {
      title: "New Acquisitions",
      value: summary?.todayOrders || 0,
      icon: <ShoppingBag size={20} />,
      color: "bg-accent-gold",
      trend: "Today"
    },
    {
      title: "New Patrons",
      value: summary?.newCustomersToday || 0,
      icon: <Users size={20} />,
      color: "bg-accent-rust",
      trend: "Today"
    },
    {
      title: "Pending Fulfillment",
      value: summary?.pendingOrders || 0,
      icon: <Clock size={20} />,
      color: "bg-accent-sage",
      trend: "Immediate"
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-xl border border-accent-gold/20 p-5 rounded-3xl shadow-2xl">
          <p className="text-[9px] font-bold uppercase tracking-widest text-accent-gold mb-3">{label}</p>
          <div className="space-y-2">
            <p className="text-sm font-bold text-accent-maroon">
              Revenue: ₹{payload[0].value.toLocaleString()}
            </p>
            <p className="text-[9px] font-bold text-text-secondary uppercase tracking-tighter">
              Orders: {payload[0].payload.orders}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-20"
    >
      {/* Header & Date Picker */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-[1px] bg-accent-gold" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">Institutional Oversight</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter">
            Dashboard <span className="italic font-light text-accent-maroon">Insights.</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 p-2 bg-primary/5 rounded-[2rem] border border-accent-gold/10">
          {['Today', 'Last 7 Days', 'Last 30 Days'].map(range => (
            <button
              key={range}
              onClick={() => {
                setDateRange(range);
                toast.info(`Time horizon shifted to ${range}`);
              }}
              className={cn(
                "px-6 py-3 rounded-[1.5rem] text-[9px] font-bold uppercase tracking-widest transition-all",
                dateRange === range 
                  ? "bg-accent-maroon text-white shadow-xl shadow-accent-maroon/20" 
                  : "text-text-secondary hover:text-accent-maroon"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-accent-gold/10 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-accent-maroon/20 transition-all shadow-sm hover:shadow-2xl"
          >
            <div className={cn("absolute top-0 right-0 w-32 h-32 opacity-5 rounded-bl-[5rem] transition-all group-hover:scale-110", stat.color)} />
            <div className="flex justify-between items-start mb-10">
              <div className={cn("p-5 rounded-2xl text-white shadow-xl", stat.color)}>
                {stat.icon}
              </div>
              <span className="text-[8px] font-bold uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full text-accent-gold">
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-secondary mb-2">{stat.title}</p>
              <h3 className="text-3xl font-heading font-bold text-text-primary tracking-tight">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sales Trend Chart */}
        <div className="lg:col-span-8 bg-white border border-accent-gold/10 rounded-[3.5rem] p-12 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-16">
            <div className="space-y-2">
              <h3 className="text-2xl font-heading font-bold text-text-primary">Revenue Anthology</h3>
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent-gold">{dateRange} performance velocity</p>
            </div>
            <Activity className="text-accent-gold/20" size={32} />
          </div>

          <div className="h-[350px] w-full min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={350}>
              <AreaChart data={summary?.revenueTrend || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#800000" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#800000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
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
                  tickFormatter={(val) => `₹${val >= 1000 ? (val/1000).toFixed(1) + 'K' : val}`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{stroke: '#800000', strokeWidth: 1}} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#800000" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="lg:col-span-4 bg-[#0a0a0a] text-white rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/5 rounded-full blur-[100px] -z-0" />
          <div className="relative z-10">
            <h3 className="text-xl font-heading font-bold mb-12 flex items-center gap-3">
              <Star className="text-accent-gold" size={20} />
              Masterpiece Rankings
            </h3>
            
            <div className="space-y-10">
              {(summary?.topProducts || []).map((product, i) => (
                <div key={i} className="flex items-center gap-5 group">
                  <div className="text-xs font-bold text-accent-gold opacity-50 group-hover:opacity-100 transition-opacity">
                    0{i + 1}
                  </div>
                  <div className="w-14 h-14 bg-white/5 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                    <img src={product.imageUrl || "/images/placeholder.png"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.title} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest truncate mb-1">{product.title}</h4>
                    <div className="flex justify-between items-center">
                      <p className="text-[8px] font-bold text-white/40 uppercase tracking-tighter">{product.unitsSold} Sold</p>
                      <p className="text-[9px] font-bold text-accent-gold">₹{product.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/admin/products" className="mt-16 w-full py-5 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-accent-gold hover:text-white transition-all">
              Complete Archive <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock Alerts */}
        <div className="bg-white border border-accent-gold/10 rounded-[3.5rem] p-12 shadow-sm">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold">Inventory Depletion</h3>
                <p className="text-[9px] font-bold uppercase tracking-widest text-text-secondary">Low stock critical alerts</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-accent-gold/5">
                  <th className="pb-6 text-[9px] font-bold uppercase tracking-widest text-text-secondary">Silhoutte</th>
                  <th className="pb-6 text-[9px] font-bold uppercase tracking-widest text-text-secondary text-center">In Archive</th>
                  <th className="pb-6 text-[9px] font-bold uppercase tracking-widest text-text-secondary text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {(summary?.lowStockAlerts || []).map((alert, i) => (
                  <tr key={i} className="group hover:bg-primary/5 transition-colors">
                    <td className="py-6">
                      <p className="text-[11px] font-bold text-text-primary uppercase tracking-tighter">{alert.title}</p>
                      <p className="text-[8px] font-bold text-text-secondary uppercase tracking-widest mt-1">{alert.sku} • {alert.size} / {alert.color}</p>
                    </td>
                    <td className="py-6 text-center">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-bold",
                        alert.stock === 0 ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                      )}>
                        {alert.stock} PCS
                      </span>
                    </td>
                    <td className="py-6 text-right">
                      <Link 
                        to={`/admin/products?search=${alert.sku}`}
                        className="p-2.5 bg-muted rounded-xl text-text-secondary hover:bg-accent-maroon hover:text-white transition-all inline-block"
                      >
                        <ExternalLink size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders Feed */}
        <div className="bg-white border border-accent-gold/10 rounded-[3.5rem] p-12 shadow-sm">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-accent-gold/10 text-accent-gold rounded-2xl">
                <Package size={24} />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold">Acquisition Feed</h3>
                <p className="text-[9px] font-bold uppercase tracking-widest text-text-secondary">Real-time patron activity</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <span className="text-[8px] font-bold uppercase tracking-widest text-text-secondary">Live</span>
            </div>
          </div>

          <div className="space-y-8">
            {(summary?.recentOrders || []).map((order, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-primary/5 rounded-[1.5rem] flex items-center justify-center text-accent-maroon text-[10px] font-bold group-hover:bg-accent-maroon group-hover:text-white transition-all duration-500">
                    {order.customerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-text-primary group-hover:text-accent-maroon transition-colors">{order.customerName}</h4>
                    <p className="text-[8px] font-bold text-text-secondary uppercase tracking-widest mt-1">{order.orderNumber} • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-text-primary">₹{order.total.toLocaleString()}</p>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-accent-gold opacity-60">{order.status}</span>
                </div>
              </div>
            ))}
          </div>

          <Link to="/admin/orders" className="mt-12 w-full py-5 bg-primary/5 border border-accent-gold/10 rounded-[2rem] flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-accent-maroon hover:text-white transition-all">
            Full Archive View <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
