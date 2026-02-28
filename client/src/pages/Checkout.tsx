import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    paymentMethod: 'cod'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const orderData = {
      customer_name: `${formData.firstName} ${formData.lastName}`,
      customer_email: formData.email,
      customer_phone: formData.phone,
      shipping_address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`,
      total_amount: cartTotal + (cartTotal > 999 ? 0 : 99),
      items: items,
      payment_method: formData.paymentMethod
    };

    try {
      const response = await fetch(`${API_BASE}/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        clearCart();
        alert('Order placed successfully!');
        navigate('/');
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred. Please try again.');
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="bg-cream-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-brown-800 mb-8 text-center">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brown-800 mb-1">First Name</label>
                <input 
                  type="text" 
                  name="firstName" 
                  required 
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border border-brown-200 p-2 rounded-sm focus:outline-none focus:border-brown-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brown-800 mb-1">Last Name</label>
                <input 
                  type="text" 
                  name="lastName" 
                  required 
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border border-brown-200 p-2 rounded-sm focus:outline-none focus:border-brown-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-800 mb-1">Email</label>
              <input 
                type="email" 
                name="email" 
                required 
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-brown-200 p-2 rounded-sm focus:outline-none focus:border-brown-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-800 mb-1">Phone</label>
              <input 
                type="tel" 
                name="phone" 
                required 
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-brown-200 p-2 rounded-sm focus:outline-none focus:border-brown-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-800 mb-1">Address</label>
              <textarea 
                name="address" 
                required 
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full border border-brown-200 p-2 rounded-sm focus:outline-none focus:border-brown-600"
              ></textarea>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-brown-800 mb-1">City</label>
                <input 
                  type="text" 
                  name="city" 
                  required 
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border border-brown-200 p-2 rounded-sm focus:outline-none focus:border-brown-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brown-800 mb-1">State</label>
                <input 
                  type="text" 
                  name="state" 
                  required 
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full border border-brown-200 p-2 rounded-sm focus:outline-none focus:border-brown-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brown-800 mb-1">ZIP</label>
                <input 
                  type="text" 
                  name="zip" 
                  required 
                  value={formData.zip}
                  onChange={handleChange}
                  className="w-full border border-brown-200 p-2 rounded-sm focus:outline-none focus:border-brown-600"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-brown-100">
              <h3 className="font-serif font-bold text-brown-800 text-lg mb-4">Payment Method</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-brown-200 rounded-sm cursor-pointer hover:bg-brown-50">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="cod" 
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                    className="text-brown-600 focus:ring-brown-600"
                  />
                  <span className="font-medium text-brown-800">Cash on Delivery (COD)</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-brown-200 rounded-sm cursor-pointer hover:bg-brown-50 opacity-60">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="razorpay" 
                    disabled
                    className="text-brown-600 focus:ring-brown-600"
                  />
                  <span className="font-medium text-brown-800">Razorpay (Coming Soon)</span>
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-brown-800 text-cream-50 py-4 text-sm font-medium uppercase tracking-wider hover:bg-brown-600 transition-colors rounded-sm mt-6"
            >
              Place Order
            </button>
          </form>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-sm shadow-sm border border-brown-100 h-fit sticky top-24">
            <h3 className="font-serif font-bold text-brown-800 text-xl mb-6">Your Order</h3>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-beige-100 rounded-sm overflow-hidden flex-shrink-0">
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-medium text-brown-800">{item.name}</p>
                      <p className="text-xs text-brown-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-medium text-brown-800">₹{(item.sale_price || item.price) * item.quantity}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-brown-100 pt-4 space-y-2 text-sm text-brown-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{cartTotal > 999 ? 'Free' : '₹99'}</span>
              </div>
              <div className="flex justify-between font-bold text-brown-800 text-lg pt-2 border-t border-brown-100 mt-2">
                <span>Total</span>
                <span>₹{cartTotal + (cartTotal > 999 ? 0 : 99)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
