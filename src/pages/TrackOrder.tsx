import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      } else {
        setError('Order not found. Please check your Order ID.');
      }
    } catch (err) {
      setError('Failed to track order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-brown-800 mb-4">Track Your Order</h1>
          <p className="text-brown-600">
            Enter your Order ID to check the current status of your shipment.
          </p>
        </div>

        <div className="bg-white p-8 rounded-sm shadow-sm border border-brown-100 mb-8">
          <form onSubmit={handleTrack} className="flex gap-4">
            <input 
              type="text" 
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Order ID (e.g., 1)"
              className="flex-grow border border-brown-200 p-3 rounded-sm focus:outline-none focus:border-brown-600"
              required
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-brown-800 text-cream-50 px-6 py-3 rounded-sm font-medium hover:bg-brown-600 transition-colors flex items-center gap-2"
            >
              {loading ? 'Tracking...' : <><Search size={18} /> Track</>}
            </button>
          </form>
          {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
        </div>

        {order && (
          <div className="bg-white p-8 rounded-sm shadow-sm border border-brown-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start mb-6 border-b border-brown-100 pb-6">
              <div>
                <h3 className="font-serif font-bold text-xl text-brown-800">Order #{order.id}</h3>
                <p className="text-sm text-brown-600">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-brown-800">₹{order.total_amount}</p>
                <p className="text-sm text-brown-600">{order.items.length} items</p>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="font-medium text-brown-800 mb-4">Order Status</h4>
              <div className="relative">
                {/* Progress Bar Background */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                {/* Steps */}
                <div className="space-y-8">
                  <Step 
                    active={true} 
                    completed={true}
                    icon={<CheckCircle size={20} />}
                    title="Order Placed"
                    date={new Date(order.created_at).toLocaleDateString()}
                  />
                  <Step 
                    active={['processing', 'shipped', 'delivered'].includes(order.status)} 
                    completed={['shipped', 'delivered'].includes(order.status)}
                    icon={<Package size={20} />}
                    title="Processing"
                    description="We are packing your handmade goodies."
                  />
                  <Step 
                    active={['shipped', 'delivered'].includes(order.status)} 
                    completed={order.status === 'delivered'}
                    icon={<Truck size={20} />}
                    title="Shipped"
                    description="Your order is on the way."
                  />
                  <Step 
                    active={order.status === 'delivered'} 
                    completed={order.status === 'delivered'}
                    icon={<CheckCircle size={20} />}
                    title="Delivered"
                    description="Enjoy your natural skincare!"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-brown-800 mb-2">Shipping Address</h4>
              <p className="text-brown-600 text-sm">{order.shipping_address}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Step({ active, completed, icon, title, date, description }: any) {
  return (
    <div className={`relative flex items-start gap-4 ${active ? 'opacity-100' : 'opacity-50'}`}>
      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 ${completed ? 'bg-green-600 border-green-600 text-white' : active ? 'bg-white border-brown-600 text-brown-600' : 'bg-white border-gray-300 text-gray-300'}`}>
        {icon}
      </div>
      <div className="pt-1">
        <h5 className={`font-medium ${completed ? 'text-green-700' : 'text-brown-800'}`}>{title}</h5>
        {date && <p className="text-xs text-brown-600">{date}</p>}
        {description && <p className="text-xs text-brown-600">{description}</p>}
      </div>
    </div>
  );
}
