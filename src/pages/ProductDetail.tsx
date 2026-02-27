import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Star, Check, Truck, ShieldCheck, X, ZoomIn } from 'lucide-react';
import { useCart, Product } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import SEO from '../components/SEO';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  
  // Zoom State
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error('Failed to fetch product', err));
  }, [slug]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-brown-600">Loading...</div>;
  }

  const schema = JSON.stringify({
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "SEWA Goatique"
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "INR",
      "price": product.sale_price || product.price,
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  });

  return (
    <div className="bg-cream-50 min-h-screen py-12">
      <SEO 
        title={product.name}
        description={product.description}
        image={product.images[0]}
        schema={schema}
      />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div 
              className="aspect-square bg-beige-100 rounded-sm overflow-hidden relative cursor-zoom-in group"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={() => setIsLightboxOpen(true)}
            >
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-100 ease-linear"
                style={{
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  transform: isHovering ? 'scale(2)' : 'scale(1)',
                }}
              />
              {!isHovering && (
                <div className="absolute bottom-4 right-4 bg-white/80 p-2 rounded-full text-brown-800 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <ZoomIn size={20} />
                </div>
              )}
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-20 h-20 rounded-sm overflow-hidden border-2 ${activeImage === index ? 'border-brown-600' : 'border-transparent'}`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <span className="text-brown-600 uppercase tracking-widest text-xs font-medium mb-2 block">{product.category}</span>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-brown-800 mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-gold-500">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <span className="text-sm text-brown-600">(24 reviews)</span>
            </div>

            <div className="text-2xl font-medium text-brown-800 mb-6">
              {product.sale_price ? (
                <>
                  <span className="mr-3">₹{product.sale_price}</span>
                  <span className="text-brown-600/50 line-through text-lg">₹{product.price}</span>
                </>
              ) : (
                <span>₹{product.price}</span>
              )}
            </div>

            <p className="text-brown-600 leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="flex gap-4 mb-8">
              <button 
                onClick={() => addToCart(product)}
                className="flex-1 bg-brown-800 text-cream-50 py-4 text-sm font-medium uppercase tracking-wider hover:bg-brown-600 transition-colors rounded-sm flex items-center justify-center gap-2"
              >
                <ShoppingBag size={18} /> Add to Cart
              </button>
            </div>

            <div className="space-y-4 border-t border-brown-100 pt-6">
              <div className="flex items-start gap-3">
                <Check size={20} className="text-green-600 mt-1" />
                <div>
                  <h4 className="font-medium text-brown-800 text-sm">100% Natural Ingredients</h4>
                  <p className="text-xs text-brown-600">Goat milk, essential oils, and plant butters.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck size={20} className="text-brown-600 mt-1" />
                <div>
                  <h4 className="font-medium text-brown-800 text-sm">Free Shipping</h4>
                  <p className="text-xs text-brown-600">On all orders above ₹999.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck size={20} className="text-brown-600 mt-1" />
                <div>
                  <h4 className="font-medium text-brown-800 text-sm">Secure Checkout</h4>
                  <p className="text-xs text-brown-600">SSL encrypted payment gateway.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button 
              className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X size={40} />
            </button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={product.images[activeImage]} 
              alt={product.name} 
              className="max-w-full max-h-[90vh] object-contain rounded-sm shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
