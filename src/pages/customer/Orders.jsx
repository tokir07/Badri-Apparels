import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, ChevronRight, ShoppingBag, Clock, MapPin, Truck, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { toast } from 'sonner';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
        toast.error("Failed to load your order history");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center pt-32">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-accent-gold border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary pt-32 pb-24 px-6 md:px-12">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <Package size={20} className="text-accent-gold" />
               <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">Your Archive</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-text-primary tracking-tighter">
              ORDER <span className="italic font-light text-accent-maroon">HISTORY.</span>
            </h1>
          </div>
          <div className="bg-white/40 backdrop-blur-xl border border-border-light rounded-2xl px-6 py-4">
             <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Total Orders</p>
             <p className="text-2xl font-heading font-bold text-text-primary">{orders.length}</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-24 bg-white/40 backdrop-blur-xl border border-border-light rounded-3xl">
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
               <ShoppingBag size={32} className="text-text-secondary/20" />
            </div>
            <h2 className="text-2xl font-heading font-bold mb-2">No Acquisitions Found</h2>
            <p className="text-text-secondary text-sm mb-10 max-w-xs mx-auto">Your order history is currently empty. Begin your collection today.</p>
            <Link to="/collections" className="inline-flex items-center gap-2 px-10 py-5 bg-text-primary text-primary rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-accent-gold transition-all shadow-xl shadow-text-primary/10">
              Explore Collections <ChevronRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/80 backdrop-blur-xl border border-border-light rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-text-primary/5 transition-all duration-500 group"
              >
                {/* Order Header */}
                <div className="p-6 md:p-8 border-b border-border-light bg-primary/30 flex flex-wrap items-center justify-between gap-6">
                  <div className="flex gap-10">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-text-secondary mb-1">Order Placed</p>
                      <p className="text-sm font-bold text-text-primary">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-text-secondary mb-1">Total Amount</p>
                      <p className="text-sm font-bold text-text-primary">₹{order.totalAmount?.toLocaleString()}</p>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-text-secondary mb-1">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                        order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-700' : 
                        order.orderStatus === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-accent-gold/10 text-accent-gold'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-[10px] font-bold text-text-secondary">ORDER #{order.orderId || order.id}</p>
                    <Link 
                      to={`/track/${order.orderId || order.id}`} 
                      className="p-3 bg-white text-text-primary rounded-xl hover:bg-accent-maroon hover:text-white transition-all shadow-sm border border-border-light"
                      title="Track Order"
                    >
                      <Truck size={18} />
                    </Link>
                  </div>
                </div>

                {/* Items */}
                <div className="p-6 md:p-8 space-y-6">
                   {order.items?.map((item, idx) => (
                     <div key={idx} className="flex gap-6 items-center">
                        <div className="w-20 h-24 bg-primary rounded-xl overflow-hidden shrink-0 border border-border-light">
                           <img 
                            src={item.product?.images?.[0]?.url || item.product?.image || 'https://via.placeholder.com/100x120?text=Item'} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                            alt={item.product?.title || 'Product'} 
                           />
                        </div>
                        <div className="flex-1 py-1">
                           <h4 className="text-lg font-heading font-bold text-text-primary mb-1">{item.product?.title || 'Heritage Piece'}</h4>
                           <div className="flex items-center gap-4 text-xs text-text-secondary">
                              <span className="font-bold">Qty: {item.quantity}</span>
                              <span className="w-1 h-1 rounded-full bg-border-light" />
                              <span className="font-bold">Size: {item.selectedSize || 'M'}</span>
                           </div>
                           <p className="text-sm font-bold text-accent-gold mt-2">₹{(item.price || 0).toLocaleString()}</p>
                        </div>
                        <Link to={`/product/${item.product?.id}`} className="hidden md:flex items-center gap-2 px-6 py-3 border border-border-light rounded-xl text-[10px] font-bold uppercase tracking-widest hover:border-text-primary transition-all">
                           Buy Again <ExternalLink size={12} />
                        </Link>
                     </div>
                   ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
