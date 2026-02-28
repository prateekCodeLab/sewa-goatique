import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Product } from '../context/CartContext';
import { Filter } from 'lucide-react';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch(err => console.error('Failed to fetch products', err));
  }, []);

  useEffect(() => {
    let result = [...products];

    if (category !== 'All') {
      result = result.filter(p => p.category === category);
    }

    if (sort === 'price-low') {
      result.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
    } else if (sort === 'price-high') {
      result.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
    }

    setFilteredProducts(result);
  }, [category, sort, products]);

  const categories = ['All', 'Soaps', 'Body Care', 'Face Care', 'Gift Sets'];

  return (
    <div className="bg-cream-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brown-800 mb-4">Shop Collection</h1>
          <p className="text-brown-600 max-w-2xl mx-auto">
            Discover our range of handcrafted goat milk skincare, made with pure ingredients and love.
          </p>
        </div>

        {/* Filters & Sort */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-4 border-b border-brown-100">
          <div className="flex items-center gap-4 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <span className="text-sm font-medium text-brown-800 flex items-center gap-2">
              <Filter size={16} /> Filter:
            </span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`text-sm px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                  category === cat 
                    ? 'bg-brown-800 text-cream-50' 
                    : 'bg-cream-100 text-brown-600 hover:bg-brown-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-4 md:mt-0 w-full md:w-auto">
            <label htmlFor="sort" className="text-sm text-brown-600">Sort by:</label>
            <select 
              id="sort" 
              value={sort} 
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent border border-brown-200 text-sm px-2 py-1 rounded-sm focus:outline-none text-brown-800"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-brown-600 text-lg">No products found in this category.</p>
            <button 
              onClick={() => setCategory('All')}
              className="mt-4 text-brown-800 underline hover:text-brown-600"
            >
              View all products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
