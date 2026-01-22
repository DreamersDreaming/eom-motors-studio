import React, { useState, useEffect } from 'react';
import { SiteConfig } from '../types';

interface NavbarProps {
  onAdminClick: () => void;
  isAdmin: boolean;
  config: SiteConfig;
}

const Navbar: React.FC<NavbarProps> = ({ onAdminClick, isAdmin, config }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Navbar height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navLinks = [
    { label: 'Showroom', id: 'showroom' },
    { label: 'Reviews', id: 'reviews' },
    { label: 'Sell My Car', id: 'sell-section' },
    { label: 'Contact', id: 'footer' },
  ];

  return (
    <nav className={`fixed w-full z-40 transition-all duration-300 ${scrolled ? 'bg-brand-black/95 backdrop-blur-md border-b border-gray-800 py-3 shadow-lg' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div 
          className="text-2xl font-bold font-montserrat tracking-tighter cursor-pointer flex items-center gap-1 group select-none"
          onClick={() => scrollToSection('hero')}
        >
          <span className="text-brand-blue group-hover:text-white transition-colors">{config.brandName}</span>
          <span className="text-white group-hover:text-brand-blue transition-colors">{config.brandNameHighlight}</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-gray-300 hover:text-brand-blue font-medium transition-colors text-sm uppercase tracking-wider"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={onAdminClick}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border transition-all ${
              isAdmin 
                ? 'bg-red-600 border-red-600 text-white hover:bg-red-700 shadow-[0_0_10px_rgba(220,38,38,0.5)]' 
                : 'border-gray-800 text-gray-600 hover:text-white hover:border-white/20'
            }`}
            title="관리자 접속"
          >
            {isAdmin ? '관리자 종료' : <i className="fas fa-lock"></i>}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden z-50">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white focus:outline-none">
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-brand-black z-40 transform transition-transform duration-300 ease-in-out flex flex-col items-center justify-center space-y-8 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => scrollToSection(link.id)}
            className="text-2xl text-white font-bold hover:text-brand-blue transition-colors font-montserrat"
          >
            {link.label}
          </button>
        ))}
        <button
          onClick={() => {
            onAdminClick();
            setMobileMenuOpen(false);
          }}
          className="text-lg text-gray-500 mt-8 border px-6 py-2 rounded-full border-gray-800"
        >
          {isAdmin ? '관리자 모드 종료' : 'Admin Login'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;