import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Heart, ShieldCheck, Truck } from 'lucide-react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import Star from '../components/Star';
import { Product } from '../context/CartContext';
import { motion } from 'motion/react';
import SEO from '../components/SEO';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setFeaturedProducts(data.slice(0, 4)))
      .catch(err => console.error('Failed to fetch products', err));
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'newsletter',
          email: email,
          details: { source: 'homepage' }
        })
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="bg-cream-50">
      <SEO 
        title="SEWA Goatique | Handmade Goat Milk Skincare"
        description="Discover pure, ethical, and empowering handmade goat milk soaps and skincare crafted by rural women artisans. Shop now and support a cause."
      />
      <Hero />

      {/* Trust Indicators */}
      <section className="py-12 bg-cream-100 border-b border-brown-100/50">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="bg-brown-100 p-3 rounded-full text-brown-600">
              <Leaf size={24} />
            </div>
            <h4 className="font-serif font-medium text-brown-800">100% Natural</h4>
            <p className="text-xs text-brown-600/80">No harsh chemicals or parabens.</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="bg-brown-100 p-3 rounded-full text-brown-600">
              <Heart size={24} />
            </div>
            <h4 className="font-serif font-medium text-brown-800">Handmade with Love</h4>
            <p className="text-xs text-brown-600/80">Crafted by rural women artisans.</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="bg-brown-100 p-3 rounded-full text-brown-600">
              <ShieldCheck size={24} />
            </div>
            <h4 className="font-serif font-medium text-brown-800">Safe for Sensitive Skin</h4>
            <p className="text-xs text-brown-600/80">Dermatologically tested formulas.</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="bg-brown-100 p-3 rounded-full text-brown-600">
              <Truck size={24} />
            </div>
            <h4 className="font-serif font-medium text-brown-800">Pan-India Shipping</h4>
            <p className="text-xs text-brown-600/80">Free shipping on orders above ₹999.</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-brown-600 uppercase tracking-widest text-xs font-medium mb-2 block">Our Bestsellers</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brown-800 mb-4">Loved by Nature & You</h2>
          <div className="w-16 h-1 bg-gold-400 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/shop" className="inline-flex items-center gap-2 text-brown-800 font-medium hover:text-brown-600 transition-colors border-b border-brown-800 pb-1">
            View All Products <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Impact Story */}
      <section className="py-20 bg-brown-800 text-cream-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           {/* Pattern or texture could go here */}
        </div>
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&q=80&w=800" 
              alt="Woman Artisan" 
              className="rounded-sm shadow-2xl transform md:rotate-2 hover:rotate-0 transition-transform duration-500"
            />
          </div>
          <div>
            <span className="text-gold-400 uppercase tracking-widest text-xs font-medium mb-2 block">Our Mission</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-cream-50 mb-6">Empowering Rural Women, One Bar at a Time.</h2>
            <p className="text-cream-100/80 text-lg leading-relaxed mb-8">
              Every purchase you make directly supports the livelihoods of women artisans in rural India. 
              We provide training, fair wages, and a platform for their craftsmanship to shine.
            </p>
            
            <div className="grid grid-cols-3 gap-6 mb-8 border-t border-cream-100/20 pt-8">
              <div>
                <h4 className="text-3xl font-serif font-bold text-gold-400 mb-1">50+</h4>
                <p className="text-xs uppercase tracking-wide text-cream-100/60">Women Empowered</p>
              </div>
              <div>
                <h4 className="text-3xl font-serif font-bold text-gold-400 mb-1">10k+</h4>
                <p className="text-xs uppercase tracking-wide text-cream-100/60">Products Sold</p>
              </div>
              <div>
                <h4 className="text-3xl font-serif font-bold text-gold-400 mb-1">5</h4>
                <p className="text-xs uppercase tracking-wide text-cream-100/60">Villages Supported</p>
              </div>
            </div>

            <Link 
              to="/impact" 
              className="bg-cream-50 text-brown-800 px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-gold-400 transition-colors rounded-sm inline-block"
            >
              Read Our Impact Story
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-beige-100">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="mb-8 text-gold-500 flex justify-center gap-1">
            {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
          </div>
          <h3 className="text-2xl md:text-3xl font-serif font-medium text-brown-800 mb-6 leading-relaxed">
            "I've never used a soap that feels this gentle. My skin feels so soft and hydrated, and knowing it supports a good cause makes it even better."
          </h3>
          <div>
            <p className="font-bold text-brown-800">Priya Sharma</p>
            <p className="text-xs text-brown-600 uppercase tracking-wide">Verified Buyer</p>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-brown-800 mb-4">Join the Movement</h2>
        <p className="text-brown-600 mb-8 max-w-lg mx-auto">
          Sign up for exclusive offers, skincare tips, and updates on our impact journey.
        </p>
        <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow bg-white border border-brown-200 px-4 py-3 text-brown-800 focus:outline-none focus:border-brown-600 rounded-sm"
          />
          <button 
            type="submit" 
            disabled={status === 'submitting'}
            className="bg-brown-800 text-cream-50 px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-brown-600 transition-colors rounded-sm"
          >
            {status === 'submitting' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
        {status === 'success' && <p className="text-green-600 mt-4">Thank you for subscribing!</p>}
        {status === 'error' && <p className="text-red-600 mt-4">Something went wrong. Please try again.</p>}
      </section>
    </div>
  );
}
