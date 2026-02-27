import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';
import { useCart, Product } from '../context/CartContext';
import { motion } from 'motion/react';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="relative overflow-hidden mb-4 bg-beige-100 aspect-[4/5] rounded-sm">
        <Link to={`/product/${product.slug}`}>
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        
        {/* Quick Add Button */}
        <button 
          onClick={() => addToCart(product)}
          className="absolute bottom-0 left-0 right-0 bg-brown-800 text-cream-50 py-3 text-sm uppercase tracking-wider font-medium translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2"
        >
          <ShoppingBag size={16} /> Add to Cart
        </button>

        {/* Badges */}
        {product.sale_price && (
          <span className="absolute top-2 left-2 bg-red-800 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wide rounded-sm">
            Sale
          </span>
        )}
      </div>

      <div className="text-center">
        <p className="text-xs text-brown-600 uppercase tracking-wide mb-1">{product.category}</p>
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-serif text-lg text-brown-800 font-medium mb-1 group-hover:text-brown-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="flex text-gold-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} fill="currentColor" />
            ))}
          </div>
          <span className="text-xs text-brown-600/60">(24 reviews)</span>
        </div>
        <div className="flex items-center justify-center gap-2 font-medium">
          {product.sale_price ? (
            <>
              <span className="text-brown-800">₹{product.sale_price}</span>
              <span className="text-brown-600/50 line-through text-sm">₹{product.price}</span>
            </>
          ) : (
            <span className="text-brown-800">₹{product.price}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
