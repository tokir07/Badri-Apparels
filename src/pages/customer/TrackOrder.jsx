import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Truck, CheckCircle2, MapPin, 
  ChevronLeft, ExternalLink, Calendar, 
  ShoppingBag, ShieldCheck, Clock,
  ArrowRight, Info
} from 'lucide-react';
import { shipmentService } from '../../services/shipmentService';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

const TrackOrder = () => {
  const { orderId } = useParams();
  const [loading, setLoading] = useState(true);
  const [shipment, setShipment] = useState(null);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    fetchTrackingData();
  }, [orderId]);

  const fetchTrackingData = async () => {
    try {
      setLoading(true);
      const res = await shipmentService.getTrackingByOrder(orderId);
      if (res.success) {
        const data = res.data;
        setShipment({
          trackingNumber: data.awbCode,
          courierPartner: data.carrier,
          estimatedDeliveryDate: data.estimatedDelivery,
          trackingUrl: data.trackingUrl,
          shipmentStatus: data.status,
          currentLocation: data.status === 'SHIPPED' ? 'In Transit' : data.status
        });
        setTimeline(shipmentService.getTimeline(data.status));
      }
    } catch (error) {
      console.error("Tracking fetch error:", error);
      toast.error("Failed to load tracking data. Please ensure the order has been shipped.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Fetching tracking data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="max-w-5xl mx-auto mb-16 space-y-8">
          <Link to="/profile/orders" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft size={14} /> Back to Orders
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground tracking-tighter">
                Track <span className="text-primary italic font-light">Shipment.</span>
              </h1>
              <p className="text-muted-foreground text-sm md:text-base max-w-lg">
                Your order is currently in transit through our premium logistics network.
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm min-w-[280px]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Package size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">AWB Tracking Number</p>
                  <p className="font-bold text-lg text-foreground uppercase">{shipment?.trackingNumber}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(shipment?.trackingNumber);
                  toast.success("Tracking number copied");
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-muted text-foreground rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all"
              >
                Copy ID <ExternalLink size={12} />
              </button>
              {shipment?.trackingUrl && (
                <a 
                  href={shipment.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-3 flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all"
                >
                  Track on Carrier Site <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Journey Section */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Timeline */}
            <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-sm relative overflow-hidden">
              <div className="space-y-12 relative">
                {timeline.map((step, index) => (
                  <div key={step.id} className="relative flex gap-8">
                    {/* Line Connector */}
                    {index !== timeline.length - 1 && (
                      <div className={cn(
                        "absolute left-5 top-10 w-[2px] h-[calc(100%+48px)] transition-all duration-1000",
                        step.isCompleted ? 'bg-primary' : 'bg-muted'
                      )} />
                    )}
                    
                    {/* Status Icon */}
                    <div className="relative z-10">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 border-2 shadow-sm",
                        step.isCompleted ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-muted text-muted-foreground'
                      )}>
                        {step.isCompleted ? <CheckCircle2 size={18} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                      </div>
                      {step.isActive && (
                        <div className="absolute inset-0 bg-primary/20 rounded-xl animate-ping" />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="pt-1.5">
                      <p className={cn(
                        "text-[9px] font-bold uppercase tracking-widest mb-1",
                        step.isCompleted ? 'text-primary' : 'text-muted-foreground'
                      )}>
                        {step.isActive ? 'Active Status' : step.isCompleted ? 'Checkpoint Reached' : 'Scheduled'}
                      </p>
                      <h3 className={cn(
                        "text-xl font-heading font-bold",
                        step.isCompleted ? 'text-foreground' : 'text-muted-foreground/40'
                      )}>
                        {step.label}
                      </h3>
                      {step.isActive && (
                        <div className="text-xs text-muted-foreground mt-2 flex items-center gap-2 bg-muted/50 w-fit px-3 py-1.5 rounded-lg border border-border">
                          <MapPin size={12} className="text-primary" /> {shipment?.currentLocation}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-2xl p-8 space-y-4">
                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-primary">
                  <Truck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">Logistics Partner</h4>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium mt-1">{shipment?.courierPartner}</p>
                </div>
                <div className="pt-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transit Mode</span>
                    <span className="font-bold">Air Express</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Priority</span>
                    <span className="font-bold text-green-600">Premium Handling</span>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-8 space-y-4">
                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-primary">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">Encrypted Data</h4>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium mt-1">End-to-End Security</p>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed mt-4 italic">
                  Specific address details are masked for your security during the tracking phase.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              
              <div className="bg-primary text-primary-foreground rounded-2xl p-8 shadow-xl relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 blur-3xl rounded-full" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest mb-10 opacity-70">Estimated Arrival</h3>
                <div className="space-y-1">
                  <p className="text-5xl font-heading font-bold tracking-tighter">15 MAY</p>
                  <p className="text-lg font-heading font-medium opacity-60 italic">Expected by End of Day</p>
                </div>
                <div className="mt-10 flex items-center gap-2.5 py-3 px-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                  <Clock size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">3 Days Remaining</span>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-8 space-y-6 shadow-sm">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">Order Total</span>
                  <span className="font-bold text-foreground">₹{shipment?.order?.totalAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">Status</span>
                  <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded text-[9px] font-bold uppercase tracking-widest border border-green-500/20">Verified</span>
                </div>
                <Link to="/profile/orders" className="w-full flex items-center justify-center gap-2 py-4 bg-muted text-foreground rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all">
                  Review Order Items <ArrowRight size={14} />
                </Link>
              </div>

              <div className="p-5 bg-primary/5 border border-primary/10 rounded-2xl flex items-center gap-4">
                <Info className="text-primary shrink-0" size={20} />
                <p className="text-[10px] text-muted-foreground leading-tight font-medium">
                  Need assistance? Contact our support team for priority shipping inquiries.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
