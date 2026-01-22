import React from 'react';
import { SiteConfig } from '../types';

interface HeroProps {
  config: SiteConfig;
}

const Hero: React.FC<HeroProps> = ({ config }) => {
  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
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

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={config.heroImageUrl || "https://picsum.photos/seed/carhero/1920/1080"} 
          alt="Luxury Supercar" 
          className="w-full h-full object-cover filter brightness-[0.3] grayscale-[30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black/80 via-transparent to-brand-black"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto animate-fade-in-up">
        <h2 className="text-brand-blue font-bold tracking-widest text-sm md:text-base uppercase mb-4">
          Premium Used Cars
        </h2>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight font-sans">
          {config.heroTitle}<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
            {config.brandName} {config.brandNameHighlight}
          </span>
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mb-10 font-light whitespace-pre-line">
          {config.heroSubtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => scrollToId('showroom')}
            className="bg-brand-blue hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2"
          >
            매물 보러가기 <i className="fas fa-arrow-right"></i>
          </button>
          <button 
            onClick={() => scrollToId('sell-section')}
            className="border border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg transition-all backdrop-blur-sm"
          >
            판매 문의하기
          </button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-gray-500">
        <i className="fas fa-chevron-down text-2xl"></i>
      </div>
    </section>
  );
};

export default Hero;