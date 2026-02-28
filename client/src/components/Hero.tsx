import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { API_BASE } from '../lib/api';

export default function Hero() {
  const [content, setContent] = useState({
    headline: 'Skincare with a Soul.',
    subheadline: 'Handcrafted goat milk skincare made by rural women artisans. Nourish your skin while empowering a community.',
    cta_text: 'Shop Collection'
  });

  useEffect(() => {
    fetch(`${API_BASE}/api/content/homepage_hero`)
      .then(res => res.json())
      .then(data => {
        if (data.headline) setContent(data);
      })
      .catch(err => console.error('Failed to fetch hero content', err));
  }, []);

  return (
    <section className="relative h-[85vh] flex items-center overflow-hidden bg-beige-200">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=2000" 
          alt="Natural Skincare Ingredients" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cream-50/90 via-cream-50/60 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <span className="text-brown-600 font-medium tracking-widest uppercase text-sm mb-4 block">
            Pure • Ethical • Empowering
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-brown-800 leading-tight mb-6">
            {content.headline}
          </h1>
          <p className="text-lg md:text-xl text-brown-800/80 mb-8 leading-relaxed max-w-lg">
            {content.subheadline}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/shop" 
              className="bg-brown-600 text-cream-50 px-8 py-4 text-sm font-medium uppercase tracking-wider hover:bg-brown-800 transition-colors rounded-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
            >
              {content.cta_text} <ArrowRight size={16} />
            </Link>
            <Link 
              to="/impact" 
              className="bg-transparent border border-brown-600 text-brown-800 px-8 py-4 text-sm font-medium uppercase tracking-wider hover:bg-brown-600 hover:text-cream-50 transition-colors rounded-sm flex items-center justify-center"
            >
              Our Impact
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Floating Badge */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute bottom-12 right-8 md:right-16 bg-cream-50/90 backdrop-blur-sm p-6 rounded-full shadow-lg hidden md:block max-w-[180px] text-center rotate-12"
      >
        <p className="font-serif font-bold text-brown-800 text-lg leading-none mb-1">100%</p>
        <p className="text-xs text-brown-600 uppercase tracking-wide">Natural & Handmade</p>
      </motion.div>
    </section>
  );
}
