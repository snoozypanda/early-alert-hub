import React from 'react';
import { HelpCircle, Shield, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="h-12 border-t border-border bg-card px-4 flex items-center justify-between text-sm text-muted-foreground">
      <div className="flex items-center gap-1">
        <Shield className="h-4 w-4 text-primary" />
        <span>ISDREM © 2024</span>
      </div>
      
      <div className="flex items-center gap-4">
        <a href="#" className="flex items-center gap-1 hover:text-foreground transition-colors">
          <HelpCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Help</span>
        </a>
        <a href="#" className="hover:text-foreground transition-colors">
          Privacy Policy
        </a>
        <a href="#" className="flex items-center gap-1 hover:text-foreground transition-colors">
          <Phone className="h-4 w-4" />
          <span className="hidden sm:inline">Contact Support</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
