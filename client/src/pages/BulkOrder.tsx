import React, { useState } from 'react';
import { Package, Building, Users, CheckCircle } from 'lucide-react';
import { API_BASE } from '../lib/api';

export default function BulkOrder() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    quantity: '',
    budget: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const res = await fetch(`${API_BASE}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'bulk',
          name: formData.contactName,
          email: formData.email,
          details: { 
            company: formData.companyName,
            quantity: formData.quantity,
            budget: formData.budget,
            message: formData.message
          }
        })
      });
      
      if (res.ok) {
        setStatus('success');
        setFormData({ companyName: '', contactName: '', email: '', quantity: '', budget: '', message: '' });
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
        {/* Hero Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-brown-600 uppercase tracking-widest text-xs font-medium mb-2 block">Corporate & Bulk Gifting</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brown-800 mb-6">Gifts with Impact</h1>
          <p className="text-brown-600 text-lg leading-relaxed">
            Partner with SEWA Goatique for sustainable, ethical, and handcrafted corporate gifts. 
            Show your appreciation while supporting rural women artisans.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-sm shadow-sm border border-brown-100 text-center">
            <div className="bg-beige-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-brown-600">
              <Package size={32} />
            </div>
            <h3 className="font-serif font-bold text-xl text-brown-800 mb-3">Custom Packaging</h3>
            <p className="text-brown-600 text-sm">
              We offer customizable packaging options with your company logo and branding for a personalized touch.
            </p>
          </div>
          <div className="bg-white p-8 rounded-sm shadow-sm border border-brown-100 text-center">
            <div className="bg-beige-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-brown-600">
              <Users size={32} />
            </div>
            <h3 className="font-serif font-bold text-xl text-brown-800 mb-3">Social Impact</h3>
            <p className="text-brown-600 text-sm">
              Every bulk order directly contributes to the training and livelihood of our women artisan groups.
            </p>
          </div>
          <div className="bg-white p-8 rounded-sm shadow-sm border border-brown-100 text-center">
            <div className="bg-beige-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-brown-600">
              <Building size={32} />
            </div>
            <h3 className="font-serif font-bold text-xl text-brown-800 mb-3">Volume Discounts</h3>
            <p className="text-brown-600 text-sm">
              Attractive pricing tiers for bulk orders, making it easier to gift sustainably at scale.
            </p>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-sm shadow-lg border-t-4 border-brown-800">
          <h2 className="text-3xl font-serif font-bold text-brown-800 mb-8 text-center">Request a Quote</h2>
          
          {status === 'success' ? (
            <div className="text-center py-12">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                <CheckCircle size={48} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-brown-800 mb-2">Inquiry Received!</h3>
              <p className="text-brown-600">
                Thank you for your interest. Our corporate sales team will get back to you within 24 hours.
              </p>
              <button 
                onClick={() => setStatus('idle')}
                className="mt-8 text-brown-800 underline hover:text-brown-600"
              >
                Send another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-brown-800 mb-1">Company Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.companyName}
                    onChange={e => setFormData({...formData, companyName: e.target.value})}
                    className="w-full border border-brown-200 p-3 rounded-sm focus:outline-none focus:border-brown-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brown-800 mb-1">Contact Person</label>
                  <input 
                    type="text" 
                    required
                    value={formData.contactName}
                    onChange={e => setFormData({...formData, contactName: e.target.value})}
                    className="w-full border border-brown-200 p-3 rounded-sm focus:outline-none focus:border-brown-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brown-800 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full border border-brown-200 p-3 rounded-sm focus:outline-none focus:border-brown-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-brown-800 mb-1">Estimated Quantity</label>
                  <select 
                    value={formData.quantity}
                    onChange={e => setFormData({...formData, quantity: e.target.value})}
                    className="w-full border border-brown-200 p-3 rounded-sm focus:outline-none focus:border-brown-600 bg-white"
                  >
                    <option value="">Select Quantity</option>
                    <option value="50-100">50 - 100 units</option>
                    <option value="100-500">100 - 500 units</option>
                    <option value="500-1000">500 - 1000 units</option>
                    <option value="1000+">1000+ units</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brown-800 mb-1">Budget Range (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.budget}
                    onChange={e => setFormData({...formData, budget: e.target.value})}
                    className="w-full border border-brown-200 p-3 rounded-sm focus:outline-none focus:border-brown-600"
                    placeholder="e.g. ₹50,000 - ₹1 Lakh"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brown-800 mb-1">Additional Requirements</label>
                <textarea 
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full border border-brown-200 p-3 rounded-sm focus:outline-none focus:border-brown-600"
                  placeholder="Tell us about your event, customization needs, or timeline..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={status === 'submitting'}
                className="w-full bg-brown-800 text-cream-50 py-4 rounded-sm font-medium hover:bg-brown-600 transition-colors uppercase tracking-wider text-sm"
              >
                {status === 'submitting' ? 'Submitting...' : 'Request Quote'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
