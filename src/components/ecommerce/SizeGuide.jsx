import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler, Info, CheckCircle2 } from 'lucide-react';

const SizeGuide = ({ isOpen, onClose, category }) => {
  const isLower = category?.toLowerCase().includes('pant') || category?.toLowerCase().includes('lower');
  
  const measurements = isLower ? [
    { size: 'S', waist: '28-30', hip: '36-38', length: '38' },
    { size: 'M', waist: '32-34', hip: '39-41', length: '39' },
    { size: 'L', waist: '36-38', hip: '42-44', length: '40' },
    { size: 'XL', waist: '40-42', hip: '45-47', length: '41' },
    { size: 'XXL', waist: '44-46', hip: '48-50', length: '42' },
  ] : [
    { size: 'S', chest: '36-38', shoulder: '15', length: '28' },
    { size: 'M', chest: '39-41', shoulder: '16', length: '29' },
    { size: 'L', chest: '42-44', shoulder: '17', length: '30' },
    { size: 'XL', chest: '45-47', shoulder: '18', length: '31' },
    { size: 'XXL', chest: '48-50', shoulder: '19', length: '32' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary text-primary-foreground rounded-xl">
                  <Ruler size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-foreground">Artisanal Size Guide</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary mt-0.5">Finding your perfect fit</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto no-scrollbar space-y-10">
              {/* Measurement Note */}
              <div className="flex gap-4 p-5 bg-accent/5 rounded-2xl border border-accent/10">
                <Info size={20} className="text-accent shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  All measurements are in <span className="font-bold text-foreground">inches</span>. Our pieces are crafted with artisanal care, please allow for a <span className="font-bold text-foreground">0.5" - 1" variance</span> in handmade garments.
                </p>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-border shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">Size</th>
                      {isLower ? (
                        <>
                          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">Waist</th>
                          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">Hip</th>
                        </>
                      ) : (
                        <>
                          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">Chest</th>
                          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">Shoulder</th>
                        </>
                      )}
                      <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {measurements.map((m, i) => (
                      <tr key={m.size} className={cn("hover:bg-primary/5 transition-colors", i !== measurements.length - 1 && "border-b border-border")}>
                        <td className="p-4 text-sm font-bold text-primary">{m.size}</td>
                        {isLower ? (
                          <>
                            <td className="p-4 text-sm font-medium text-foreground">{m.waist}"</td>
                            <td className="p-4 text-sm font-medium text-foreground">{m.hip}"</td>
                          </>
                        ) : (
                          <>
                            <td className="p-4 text-sm font-medium text-foreground">{m.chest}"</td>
                            <td className="p-4 text-sm font-medium text-foreground">{m.shoulder}"</td>
                          </>
                        )}
                        <td className="p-4 text-sm font-medium text-foreground">{m.length}"</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* How to measure */}
              <div className="space-y-6">
                <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">How to Measure</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold text-xs">1</div>
                    <div>
                      <p className="text-xs font-bold text-foreground mb-1">Chest/Bust</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">Measure around the fullest part of your chest, keeping the tape horizontal.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold text-xs">2</div>
                    <div>
                      <p className="text-xs font-bold text-foreground mb-1">Waist</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">Measure around your natural waistline, typically the narrowest part.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="pt-6 border-t border-border flex items-center gap-2 text-green-600">
                <CheckCircle2 size={16} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Crafted for a Relaxed, Artisanal Fit</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SizeGuide;
