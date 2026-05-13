import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-8 max-w-md"
          >
            <div className="flex justify-center">
              <div className="p-6 bg-destructive/10 rounded-full">
                <AlertTriangle className="text-destructive w-12 h-12" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-heading font-bold text-foreground">Heritage Disrupted.</h1>
              <p className="text-muted-foreground italic">
                A technical misalignment occurred while accessing the archive. Our artisans have been notified.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-transform"
              >
                <RefreshCcw size={16} /> Reconnect
              </button>
              <a
                href="/"
                className="flex items-center justify-center gap-2 px-8 py-4 border border-border rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-muted/50 transition-colors"
              >
                <Home size={16} /> Return to Sanctuary
              </a>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
