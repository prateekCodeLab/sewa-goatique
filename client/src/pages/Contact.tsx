import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const res = await fetch(`${API_BASE}/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          details: { message: formData.message }
        })
      });
      
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="bg-cream-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-brown-800 mb-4">Contact Us</h1>
          <p className="text-brown-600 max-w-2xl mx-auto">
            Have questions about our products or want to know more about our impact? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="bg-brown-800 text-cream-50 p-8 rounded-sm shadow-lg">
            <h3 className="text-2xl font-serif font-bold mb-8">Get in Touch</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-brown-600 p-3 rounded-full">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-gold-400 mb-1">Email Us</h4>
                  <p className="text-cream-100/80">hello@sewagoatique.com</p>
                  <p className="text-cream-100/80">support@sewagoatique.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-brown-600 p-3 rounded-full">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-gold-400 mb-1">Call Us</h4>
                  <p className="text-cream-100/80">+91 98765 43210</p>
                  <p className="text-xs text-cream-100/60 mt-1">Mon-Fri, 9am - 6pm IST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-brown-600 p-3 rounded-full">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-gold-400 mb-1">Visit Us</h4>
                  <p className="text-cream-100/80">
                    SEWA Goatique HQ<br />
                    123 Artisan Village<br />
                    Jaipur, Rajasthan 302001<br />
                    India
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-cream-100/20">
              <h4 className="font-serif font-bold mb-4">Follow Our Journey</h4>
              <div className="flex gap-4">
                {/* Social Icons would go here */}
                <span className="text-sm text-cream-100/60">@sewagoatique</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-8 rounded-sm shadow-sm border border-brown-100">
            <h3 className="text-2xl font-serif font-bold text-brown-800 mb-6">Send a Message</h3>
            
            {status === 'success' && (
              <div className="bg-green-50 text-green-800 p-4 rounded-sm mb-6 border border-green-200">
                Thank you for reaching out! We'll get back to you shortly.
              </div>
            )}

            {status === 'error' && (
              <div className="bg-red-50 text-red-800 p-4 rounded-sm mb-6 border border-red-200">
                Something went wrong. Please try again later.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-brown-800 mb-1">Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-brown-200 p-3 rounded-sm focus:outline-none focus:border-brown-600"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-brown-800 mb-1">Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full border border-brown-200 p-3 rounded-sm focus:outline-none focus:border-brown-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brown-800 mb-1">Phone</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full border border-brown-200 p-3 rounded-sm focus:outline-none focus:border-brown-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brown-800 mb-1">Message</label>
                <textarea 
                  rows={4}
                  required
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full border border-brown-200 p-3 rounded-sm focus:outline-none focus:border-brown-600"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={status === 'submitting'}
                className="w-full bg-brown-800 text-cream-50 py-3 rounded-sm font-medium hover:bg-brown-600 transition-colors uppercase tracking-wider text-sm flex items-center justify-center gap-2"
              >
                {status === 'submitting' ? 'Sending...' : <><Send size={16} /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
