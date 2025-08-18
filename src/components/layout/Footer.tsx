import React from 'react';
import { BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary/30 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="lg:col-span-2">
          
          <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-primary-glow">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text text-foreground">Journal.sol</span>
          </div>

          <p className="text-muted-foreground mb-6">
            The future of personal journaling on the blockchain. Secure, permanent, and completely yours.
          </p>

        </div>

        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center"> 
          <p className="text-muted-foreground text-sm">
            &copy; 2024 Journal.sol. All rights reserved.
          </p>

          <p className="text-muted-foreground text-sm mt-4 sm:mt-0">
            Built on Solana • Powered by Web3
          </p>
        </div>

      </div>
    </footer>
  );
};