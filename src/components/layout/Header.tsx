"use client";

import React from 'react';
import { BookOpen, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CustomWalletButton from '@/components/wallet/CustomWalletButtonWrapper'
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  //   const [showNavBar, setShowNavBar] = useState(true);
  //   const [lastScrollY, setLastScrollY] = useState(0);
  
  //   const toggleMenu = () => setIsOpen(!isOpen);
  //   const controllNavBar = () => {
  //     if (window.scrollY > lastScrollY) {
  //       setShowNavBar(false);
  //     } else {
  //       setShowNavBar(true);
  //     }
  //     setLastScrollY(window.scrollY);
  //   };
  
  //   useEffect(() => {
  //     window.addEventListener("scroll", controllNavBar);
  //     return () => {
  //       window.removeEventListener("scroll", controllNavBar);
  //     };
  //   }, [lastScrollY]);
  
  const navigation = [
    { name: 'Home', href: '#' },
    { name: 'My Journal', href: '#journal' },
    { name: 'Explore', href: '#explore' },
    { name: 'About', href: '#about' },
  ];

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <header className="fixed top-0 w-full z-10">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center space-x-2 z-20">
            <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-primary-glow">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text text-foreground">Journal.sol</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-foreground/80 hover:text-foreground transition-colors hover:underline"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <CustomWalletButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2 z-20">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-10 w-10 text-foreground" />
              ) : (
                <Menu className="h-10 w-10 text-foreground" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`${mobileMenuOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 fixed top-0 left-0 h-dvh w-full flex items justify-center md:hidden backdrop-blur-md`}>
          <div className="flex flex-col space-y-8 justify-center items-center">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-foreground/80 hover:text-foreground transition-colors px-2 font-bold"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="px-2 pt-2">
              <CustomWalletButton />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};