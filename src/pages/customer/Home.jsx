import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Star, ShieldCheck, Leaf, Heart, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ecommerce/ProductCard';
import BrandLogo from '../../components/common/BrandLogo';
import { productService } from '../../services/productService';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

const Home = () => {
   const [featuredProducts, setFeaturedProducts] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      fetchFeaturedProducts();
   }, []);

   const fetchFeaturedProducts = async () => {
      try {
         setLoading(true);
         const response = await productService.getAllProducts({ size: 4 });
         setFeaturedProducts(response.data.content || []);
      } catch (error) {
         console.error("Failed to fetch featured products:", error);
      } finally {
         setLoading(false);
      }
   };

   const handleNewsletterSubmit = (e) => {
      e.preventDefault();
      const email = e.target.email.value;
      if (email) {
         toast.success("Welcome to the Collective", { 
            description: "You've been successfully enrolled in our heritage dispatches." 
         });
         e.target.reset();
      }
   };

   return (
      <div className="bg-background min-h-screen">

         {/* HERO SECTION - REFINED LUXURY */}
         <section className="relative h-[80vh] flex items-center overflow-hidden">
            {/* Background Image with Parallax effect simulation */}
            <div className="absolute inset-0 z-0">
               <img
                  src="/images/jaipuri_kurti_hero_1778263445000_1778264668567.png"
                  alt="Jaipuri Luxury"
                  className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-black/30" />
               <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            <div className="container relative z-10 px-6 md:px-12">
               <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-2xl space-y-8"
               >
                  <div className="flex items-center gap-3">
                     <div className="w-12 h-[1px] bg-accent" />
                     <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white">Handcrafted in Jaipur</span>
                  </div>

                  <h1 className="text-5xl md:text-7xl font-heading font-bold text-white tracking-tight leading-[1.1]">
                     Artisanal Heritage <br />
                     <span className="italic font-light text-accent">Modern Grace.</span>
                  </h1>

                  <p className="text-white/80 text-lg max-w-lg leading-relaxed font-light">
                     Discover our curated collection of handmade kurties, where every thread tells a story of Jaipur's rich textile history.
                  </p>

                  <div className="pt-4 flex flex-wrap gap-4">
                     <Link
                        to="/collections"
                        className="px-10 py-4 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-foreground transition-all shadow-xl"
                     >
                        Explore Anthology
                     </Link>
                     <Link
                        to="/lookbook"
                        className="px-10 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-white/20 transition-all"
                     >
                        The Lookbook
                     </Link>
                  </div>
               </motion.div>
            </div>
         </section>

         {/* FEATURED STYLES */}
         <section className="py-24 container mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
               <div className="space-y-3">
                  <h2 className="text-3xl md:text-5xl font-heading font-bold tracking-tight">
                     Curated <span className="italic font-light text-muted-foreground">Styles.</span>
                  </h2>
                  <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                     Handpicked masterpieces from our latest artisanal collective.
                  </p>
               </div>
               <Link to="/products" className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary">
                  View All Products
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>

            {loading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[1, 2, 3, 4].map((i) => (
                     <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-xl" />
                  ))}
               </div>
            ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {featuredProducts.map((product) => (
                     <ProductCard key={product.id} product={product} />
                  ))}
               </div>
            )}
         </section>

         {/* JAIPURI KURTI SANCTUARY */}
         <section className="py-24 bg-[#0a0a0a] text-white overflow-hidden">
            <div className="container mx-auto px-6 md:px-12">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <motion.div
                     initial={{ opacity: 0, x: -30 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 1 }}
                     className="space-y-8"
                  >
                     <div className="space-y-4">
                        <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-accent-gold">The Collection</span>
                        <h2 className="text-4xl md:text-6xl font-heading font-bold tracking-tight leading-tight">
                           Jaipuri Kurti <br />
                           <span className="italic font-light text-accent-gold/60">Sanctuary.</span>
                        </h2>
                        <p className="text-white/60 text-lg leading-relaxed font-light max-w-lg">
                           Every stitch in our Jaipuri collective is a testament to the master block printers of Sanganer and Bagru. Experience the confluence of comfort and royal heritage.
                        </p>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[
                           { name: 'Artisanal Block Prints', count: '12 Pieces', path: '/collections/kurties' },
                           { name: 'Heritage Anarkalis', count: '08 Pieces', path: '/collections/kurties' },
                           { name: 'Chanderi Grace', count: '05 Pieces', path: '/collections/kurties' },
                           { name: 'Festive Silhouettes', count: '10 Pieces', path: '/collections/kurties' },
                        ].map((cat, i) => (
                           <Link
                              key={cat.name}
                              to={cat.path}
                              className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-accent-gold/10 hover:border-accent-gold/30 transition-all"
                           >
                              <div className="flex justify-between items-start mb-4">
                                 <span className="text-[9px] font-bold uppercase tracking-widest text-accent-gold/60">{cat.count}</span>
                                 <ArrowRight size={14} className="text-accent-gold opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                              </div>
                              <p className="font-bold text-sm tracking-tight">{cat.name}</p>
                           </Link>
                        ))}
                     </div>

                     <div className="pt-4">
                        <Link to="/collections/kurties" className="inline-flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-accent-gold hover:text-white transition-colors group">
                           Discover Entire Collective
                           <div className="w-10 h-[1px] bg-accent-gold group-hover:w-16 transition-all" />
                        </Link>
                     </div>
                  </motion.div>

                  <motion.div
                     initial={{ opacity: 0, scale: 0.9 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true }}
                     transition={{ duration: 1.2 }}
                     className="relative aspect-[4/5]"
                  >
                     <div className="absolute inset-0 border border-accent-gold/20 translate-x-6 translate-y-6 rounded-2xl" />
                     <img
                        src="/src/assets/WhatsApp Image 2026-05-11 at 1.34.14 AM (1).jpeg"
                        alt="Jaipuri Kurti Collection"
                        className="w-full h-full object-cover rounded-2xl relative z-10 grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-20 rounded-2xl" />

                     <div className="absolute bottom-10 left-10 z-30">
                        <div className="flex items-center gap-3">
                           <Sparkles size={20} className="text-accent-gold animate-pulse" />
                           <p className="text-[10px] font-bold uppercase tracking-widest text-white">Spring/Summer '26</p>
                        </div>
                     </div>
                  </motion.div>
               </div>
            </div>
         </section>

         {/* BRAND PHILOSOPHY */}
         <section className="py-24 bg-muted/30 border-y border-border">
            <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div className="relative">
                  <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl">
                     <img src="/images/block_print_collection_1778263468000_1778264691387.png" alt="Jaipur Craft" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-10 -right-10 hidden md:block w-64 aspect-square bg-background border border-border p-8 rounded-xl shadow-xl z-10">
                     <div className="space-y-4">
                        <div className="w-10 h-[1px] bg-accent" />
                        <p className="text-xs font-bold uppercase tracking-wider">Craftsmanship</p>
                        <p className="text-[10px] text-muted-foreground leading-relaxed italic">"Every piece is a labor of love, passed through generations of master block printers."</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-8">
                  <div className="space-y-3">
                     <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Our Philosophy</span>
                     <h2 className="text-4xl md:text-6xl font-heading font-bold tracking-tight leading-tight">
                        The Art of <br />
                        <span className="italic font-light text-muted-foreground">Sow & Sew.</span>
                     </h2>
                  </div>

                  <p className="text-muted-foreground text-lg leading-relaxed font-light">
                     BADRIBHAI APPAREL is a tribute to the timeless artisans of Jaipur. We believe in slow fashion—where quality, ethics, and heritage converge into masterpieces.
                  </p>

                  <div className="grid grid-cols-2 gap-8 pt-4">
                     {[
                        { icon: <BrandLogo className="w-5 h-5 text-primary" color="currentColor" />, title: 'Ethical', desc: 'Sourced directly' },
                        { icon: <ShieldCheck size={20} className="text-primary" />, title: 'Authentic', desc: 'GI Tagged Craft' },
                     ].map((item, i) => (
                        <div key={`philosophy-${i}`} className="space-y-3">
                           <div className="w-12 h-12 bg-background border border-border rounded-xl flex items-center justify-center shadow-sm">
                              {item.icon}
                           </div>
                           <div>
                              <p className="font-bold text-xs uppercase tracking-wider">{item.title}</p>
                              <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </section>

         {/* NEWSLETTER */}
         <section className="py-24">
            <div className="container mx-auto px-6 md:px-12">
               <div className="bg-primary rounded-xl p-12 md:p-20 text-center space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px]" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px]" />

                  <div className="space-y-3 relative z-10">
                     <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary-foreground tracking-tight">
                        Join the <span className="italic font-light text-accent">Collective.</span>
                     </h2>
                     <p className="text-primary-foreground/60 text-sm max-w-lg mx-auto font-light">
                        Receive exclusive access to our handcrafted collections and new arrivals.
                     </p>
                  </div>

                  <div className="relative z-10">
                     <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                        <input
                           name="email"
                           type="email"
                           required
                           placeholder="Enter your email"
                           className="flex-1 bg-white/10 border border-white/20 rounded-xl py-4 px-6 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-all"
                        />
                        <button type="submit" className="px-10 py-4 bg-white text-primary rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-xl">
                           Subscribe
                        </button>
                     </form>
                  </div>
               </div>
            </div>
         </section>

      </div>
   );
};

export default Home;
