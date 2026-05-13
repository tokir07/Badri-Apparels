import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, ChevronDown, Package, MapPin, 
  ArrowRight, Download, RefreshCw, Star, ArrowUpRight,
  Sparkles, ShieldCheck, ShoppingBag, Truck, ExternalLink,
  ChevronRight, Calendar, CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { orderService } from '../../../services/orderService';
import { shipmentService } from '../../../services/shipmentService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const OrderStatusTimeline = ({ status }) => {
  const steps = shipmentService.getTimeline(status);
  
  return (
    <div className="flex items-center w-full max-w-lg mt-8">
      {steps.map((step, idx) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center relative group">
            <div className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-500",
              step.isCompleted ? "bg-accent-maroon border-accent-maroon text-white" : "bg-white border-accent-gold/20 text-accent-gold/40"
            )}>
              {step.isCompleted && <CheckCircle2 size={10} />}
            </div>
            <span className={cn(
              "absolute -bottom-6 text-[7px] font-bold uppercase tracking-tighter whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity",
              step.isActive ? "opacity-100 text-accent-maroon" : "text-muted-foreground"
            )}>
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className={cn(
              "flex-1 h-[2px] transition-all duration-1000",
              step.isCompleted && steps[idx+1].isCompleted ? "bg-accent-maroon" : "bg-accent-gold/10"
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const AccountOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderService.getUserOrders();
        if (response.success) {
          setOrders(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast.error("Failed to load your heritage archive");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleDownloadInvoice = async (orderId, orderNumber) => {
    try {
      toast.loading("Generating heritage record...", { id: 'invoice-download' });
      const response = await orderService.downloadInvoice(orderId);
      
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderNumber || orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success("Invoice archived successfully", { id: 'invoice-download' });
    } catch (error) {
      console.error("Failed to download invoice:", error);
      toast.error("Failed to extract invoice archive", { id: 'invoice-download' });
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'All' || order.orderStatus === activeTab;
    const matchesSearch = (order.orderNumber || order.orderId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items?.some(item => item.product?.title?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-accent-gold border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <Sparkles size={16} className="text-accent-gold" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">Order History</span>
           </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-text-primary tracking-tight">
            Acquisition <span className="italic font-light text-accent-maroon">Archive.</span>
          </h1>
          <p className="text-text-secondary text-sm font-medium max-w-xl leading-relaxed">
            Review your collection of BadriBhai artisanal pieces and track their journey to your residence.
          </p>
        </div>
        
        <div className="relative group">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-accent-gold group-focus-within:text-accent-maroon transition-colors" size={18} />
           <input 
             type="text"
             placeholder="Search archive..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="bg-primary/5 border border-accent-gold/10 rounded-2xl pl-14 pr-8 py-5 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-accent-maroon/10 transition-all min-w-[320px]"
           />
        </div>
      </div>

      {/* Modern Ethnic Tabs */}
      <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-10 py-4 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all duration-500 border whitespace-nowrap",
              activeTab === tab 
                ? 'bg-accent-maroon text-white border-accent-maroon shadow-2xl shadow-accent-maroon/20 scale-105' 
                : 'bg-white border-accent-gold/10 text-text-secondary hover:border-accent-maroon hover:text-accent-maroon'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders Archive List */}
      <div className="space-y-12">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border border-accent-gold/10 rounded-[3.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 group"
            >
              {/* Order Card Header: Heritage Credentials */}
              <div className="p-10 md:p-12 bg-primary/5 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-10 flex-1">
                    <div>
                       <p className="text-[9px] uppercase tracking-widest font-bold text-accent-gold mb-2 flex items-center gap-2"><Calendar size={12} /> Order Date</p>
                       <p className="text-sm font-bold text-text-primary">
                         {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                       </p>
                    </div>
                    <div>
                       <p className="text-[9px] uppercase tracking-widest font-bold text-accent-gold mb-2 flex items-center gap-2"><Package size={12} /> Credentials</p>
                       <p className="text-sm font-bold text-text-primary tracking-tighter">#{order.orderId || order.id}</p>
                    </div>
                    <div>
                       <p className="text-[9px] uppercase tracking-widest font-bold text-accent-gold mb-2">Total Amount</p>
                       <p className="text-sm font-bold text-accent-maroon">₹{order.totalAmount?.toLocaleString()}</p>
                    </div>
                    <div>
                       <p className="text-[9px] uppercase tracking-widest font-bold text-accent-gold mb-2">Fulfillment</p>
                       <span className={cn(
                          "text-[8px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border",
                          order.orderStatus === 'DELIVERED' ? 'bg-green-50 text-green-600 border-green-100' : 
                          order.orderStatus === 'CANCELLED' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-accent-gold/10 text-accent-gold border-accent-gold/20'
                       )}>
                          {order.orderStatus}
                       </span>
                    </div>
                 </div>
                 
                  <div className="flex items-center gap-4">
                    {(order.orderStatus === 'DELIVERED' || order.paymentStatus === 'PAID') && (
                      <button 
                        onClick={() => handleDownloadInvoice(order.id, order.orderNumber)}
                        className="w-14 h-14 bg-white border border-accent-gold/10 rounded-2xl text-accent-maroon hover:bg-accent-maroon hover:text-white transition-all shadow-sm flex items-center justify-center group/btn" 
                        title="Download Archive Record"
                      >
                         <Download size={20} />
                      </button>
                    )}
                    <Link to={`/track/${order.orderId || order.id}`} className="px-10 py-5 bg-text-primary text-white rounded-2xl text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-accent-maroon transition-all shadow-xl">
                       Track Journey
                    </Link>
                 </div>
              </div>

              {/* Order Content: Artisanal Gallery */}
              <div className="p-10 md:p-14">
                 <div className="flex flex-col xl:flex-row gap-20">
                    {/* Items Gallery */}
                    <div className="flex-1 space-y-12">
                       {order.items?.map((item, i) => (
                         <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-10 group/item">
                            <div className="w-28 h-36 md:w-32 md:h-40 rounded-[2rem] overflow-hidden bg-primary/10 shrink-0 border border-accent-gold/5 relative">
                               <img 
                                src={item.product?.images?.[0]?.url || item.product?.image || 'https://via.placeholder.com/200x300?text=Heritage'} 
                                alt={item.product?.title} 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover/item:scale-110" 
                               />
                               <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                            </div>
                            <div className="flex-1 space-y-4">
                               <div className="flex items-center gap-3">
                                  <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent-gold">Artisanal Piece</span>
                                  <div className="w-1.5 h-1.5 rounded-full bg-accent-gold/30" />
                                  <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent-maroon">BadriBhai Collective</span>
                               </div>
                               <h4 className="text-2xl md:text-3xl font-heading font-bold text-text-primary group-hover/item:text-accent-maroon transition-colors">{item.product?.title || 'Heritage Garment'}</h4>
                               <div className="flex flex-wrap items-center gap-6 text-[10px] text-text-secondary uppercase tracking-widest font-bold opacity-60">
                                  <span>Quantity: {item.quantity}</span>
                                  <span className="w-1 h-1 rounded-full bg-border" />
                                  <span>Silhouette: {item.selectedSize || 'M'}</span>
                                  {item.selectedColor && (
                                    <>
                                      <span className="w-1 h-1 rounded-full bg-border" />
                                      <span>Hue: {item.selectedColor}</span>
                                    </>
                                  )}
                               </div>
                               <div className="pt-6 flex items-center gap-8">
                                  <span className="text-xl font-bold text-text-primary font-heading">₹{(item.price || 0).toLocaleString()}</span>
                                  <Link to={`/product/${item.product?.id}`} className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-accent-gold hover:text-accent-maroon transition-colors">
                                     Re-acquire Piece <ArrowUpRight size={14} />
                                  </Link>
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>

                    {/* Status Tracking & Support */}
                    <div className="xl:w-[400px] space-y-10">
                       <div className="bg-primary/5 border border-accent-gold/10 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-8 text-accent-gold/5 pointer-events-none">
                             <Truck size={120} strokeWidth={0.5} />
                          </div>
                          <div className="flex items-center gap-4 mb-8">
                             <div className="w-12 h-12 bg-white border border-accent-gold/10 rounded-2xl flex items-center justify-center text-accent-gold shadow-sm">
                                <ShieldCheck size={24} />
                             </div>
                             <h5 className="text-[11px] uppercase tracking-[0.3em] font-bold text-text-primary">Fulfillment Status</h5>
                          </div>
                          
                          <div className="space-y-6">
                             <p className="text-sm text-text-secondary leading-relaxed font-medium italic">
                                "Your artisanal acquisition is currently in the <span className="font-bold text-accent-maroon uppercase tracking-widest">{order.orderStatus}</span> stage of its journey."
                             </p>
                             
                             <OrderStatusTimeline status={order.orderStatus} />
                            
                            <div className="pt-6 border-t border-accent-gold/10 space-y-6">
                               <button className="w-full py-5 bg-accent-maroon text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:brightness-110 transition-all flex items-center justify-center gap-3 shadow-xl shadow-accent-maroon/20">
                                  <RefreshCw size={16} /> Re-Order Selection
                               </button>
                               <button className="w-full py-5 bg-white text-text-secondary border border-accent-gold/10 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:text-red-500 hover:border-red-100 transition-all">
                                  Request Support
                               </button>
                            </div>
                          </div>
                       </div>

                       <div className="px-8 flex items-center gap-4 text-accent-gold opacity-50">
                          <Sparkles size={20} />
                          <p className="text-[9px] font-bold uppercase tracking-[0.4em]">Heritage Guaranteed</p>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-40 flex flex-col items-center justify-center text-center space-y-12 bg-primary/5 rounded-[4rem] border-2 border-dashed border-accent-gold/10">
             <div className="w-40 h-40 rounded-full bg-white flex items-center justify-center border border-accent-gold/20 shadow-2xl relative group">
                <ShoppingBag size={56} className="text-accent-gold/20 group-hover:scale-110 transition-transform duration-700" />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 border-2 border-dashed border-accent-gold/10 rounded-full"
                />
             </div>
             <div className="space-y-6">
                <h3 className="text-5xl font-heading font-bold text-text-primary tracking-tight">Empty Archive</h3>
                <p className="text-text-secondary max-w-sm mx-auto font-medium leading-relaxed">Your collection of BadriBhai originals is waiting to be started. Begin your journey today.</p>
             </div>
             <Link to="/collections" className="px-14 py-6 bg-accent-maroon text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-2xl shadow-accent-maroon/20">
                Explore Collections
             </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountOrders;
