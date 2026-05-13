import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle2, MessageSquare, Send, User, Calendar, Loader2 } from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const ReviewSection = ({ productId }) => {
  const { user, isAuthenticated } = useAuthStore();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    setLoading(true);
    const res = await reviewService.getProductReviews(productId);
    if (res.success) {
      setReviews(res.data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please sign in to share your experience");
      return;
    }
    
    setSubmitting(true);
    const res = await reviewService.submitReview({
      productId,
      ...formData
    });

    if (res.success) {
      toast.success(res.message);
      setShowForm(false);
      setFormData({ rating: 5, comment: '' });
      fetchReviews();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-16 py-20 border-t border-border">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-primary/10 text-primary text-[8px] font-bold uppercase tracking-[0.4em] rounded-full">Patron Feedback</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
            The Heritage <span className="italic font-light text-primary">Voices.</span>
          </h2>
          <p className="text-muted-foreground text-sm font-medium max-w-xl">
            Read experiences from our global community of artisans and patrons.
          </p>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-center">
            <p className="text-4xl font-heading font-bold text-foreground">{averageRating}</p>
            <div className="flex items-center gap-0.5 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className={cn(i < Math.floor(averageRating) ? "fill-accent text-accent" : "text-muted")} />
              ))}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2">{reviews.length} Experiences</p>
          </div>
          <div className="h-12 w-px bg-border" />
          <button 
            onClick={() => setShowForm(!showForm)}
            className="px-8 py-4 bg-primary text-primary-foreground rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-lg"
          >
            {showForm ? 'Cancel Curation' : 'Share Experience'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="bg-muted/50 p-8 md:p-12 rounded-[2.5rem] border border-border space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Select Rating</label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className={cn(
                        "w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all",
                        formData.rating >= star ? "bg-accent/10 border-accent text-accent" : "bg-background border-border text-muted"
                      )}
                    >
                      <Star size={20} fill={formData.rating >= star ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Detailed Experience</label>
                <textarea
                  required
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Describe the craftsmanship, fit, and feel..."
                  className="w-full bg-background border border-border rounded-2xl p-6 text-sm focus:ring-2 focus:ring-primary/20 outline-none min-h-[150px] transition-all"
                />
              </div>

              <div className="flex justify-end">
                <button
                  disabled={submitting}
                  className="px-10 py-4 bg-primary text-primary-foreground rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 hover:brightness-110 transition-all shadow-xl"
                >
                  {submitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                  Submit to Archive
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-[2.5rem]" />
          ))
        ) : reviews.length > 0 ? (
          reviews.map((review, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={review.id}
              className="bg-card border border-border p-8 rounded-[2.5rem] space-y-6 hover:border-primary/30 transition-all group"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-heading font-bold overflow-hidden shadow-lg">
                    {review.userAvatar ? (
                      <img src={review.userAvatar} className="w-full h-full object-cover" />
                    ) : (
                      review.userName.charAt(0)
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{review.userName}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      {review.verifiedPurchase && (
                        <div className="flex items-center gap-1 text-[8px] font-bold uppercase text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                          <CheckCircle2 size={10} /> Verified Purchase
                        </div>
                      )}
                      <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-tighter">
                        {new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} className={cn(i < review.rating ? "fill-accent text-accent" : "text-muted/30")} />
                  ))}
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed italic">
                "{review.comment}"
              </p>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 bg-muted/20 border border-dashed border-border rounded-[2.5rem] flex flex-col items-center justify-center text-center px-10">
            <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <MessageSquare className="text-muted-foreground/20" size={28} />
            </div>
            <h4 className="text-lg font-heading font-bold text-foreground mb-2">No Experiences Yet</h4>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">Be the first to share your journey with this artisanal piece.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
