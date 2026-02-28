import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-cream-50 text-center px-4">
        <h2 className="text-2xl font-serif font-bold text-brown-800 mb-4">Your cart is empty</h2>
        <p className="text-brown-600 mb-8">Looks like you haven't added any items yet.</p>
        <Link 
          to="/shop" 
          className="bg-brown-800 text-cream-50 px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-brown-600 transition-colors rounded-sm"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-cream-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-brown-800 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map(item => (
              <div key={item.id} className="flex gap-4 bg-white p-4 rounded-sm shadow-sm border border-brown-100">
                <div className="w-24 h-24 bg-beige-100 rounded-sm overflow-hidden flex-shrink-0">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-serif font-medium text-brown-800 text-lg">{item.name}</h3>
                      <p className="text-sm text-brown-600">{item.category}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-brown-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex items-center border border-brown-200 rounded-sm">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 text-brown-600 hover:bg-brown-50"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-4 text-sm font-medium text-brown-800">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 text-brown-600 hover:bg-brown-50"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-brown-800">₹{(item.sale_price || item.price) * item.quantity}</p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-brown-600">₹{item.sale_price || item.price} each</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-sm shadow-sm border border-brown-100 sticky top-24">
              <h3 className="font-serif font-bold text-brown-800 text-xl mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6 text-sm text-brown-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{cartTotal > 999 ? 'Free' : '₹99'}</span>
                </div>
                <div className="flex justify-between font-medium text-brown-800 pt-4 border-t border-brown-100">
                  <span>Total</span>
                  <span>₹{cartTotal + (cartTotal > 999 ? 0 : 99)}</span>
                </div>
              </div>

              <Link 
                to="/checkout" 
                className="w-full bg-brown-800 text-cream-50 py-3 text-sm font-medium uppercase tracking-wider hover:bg-brown-600 transition-colors rounded-sm flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </Link>
              
              <div className="mt-6 text-xs text-center text-brown-600/60">
                <p>Secure Checkout • 100% Satisfaction Guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
