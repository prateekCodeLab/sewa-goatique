import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { API_BASE } from '../lib/api';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  author: string;
  published: boolean;
  created_at: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/posts`)
      .then(res => res.json())
      .then(data => {
        // Filter only published posts for the public view
        const publishedPosts = data.filter((post: BlogPost) => post.published);
        setPosts(publishedPosts);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch posts', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-brown-800 font-serif text-xl">Loading Journal...</div>
      </div>
    );
  }

  return (
    <div className="bg-cream-50 min-h-screen">
      <SEO 
        title="Journal | SEWA Goatique" 
        description="Read about our latest adventures, skincare tips, and stories from the villages we work with."
      />
      
      {/* Hero Section */}
      <div className="bg-brown-900 text-cream-50 py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">The SEWA Journal</h1>
          <p className="text-lg text-brown-200 max-w-2xl mx-auto">
            Stories of empowerment, sustainable living, and the art of handmade skincare.
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="container mx-auto px-4 py-16">
        {posts.length === 0 ? (
          <div className="text-center text-brown-600 py-12">
            <p className="text-xl">No stories yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <article key={post.id} className="bg-white rounded-sm shadow-sm overflow-hidden border border-brown-100 hover:shadow-md transition-shadow flex flex-col h-full">
                <Link to={`/blog/${post.slug}`} className="block aspect-video overflow-hidden bg-gray-100">
                  {post.image ? (
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brown-300">
                      <span className="font-serif italic">No Image</span>
                    </div>
                  )}
                </Link>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-brown-500 mb-3 uppercase tracking-wider font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      {post.author}
                    </span>
                  </div>
                  <h2 className="text-xl font-serif font-bold text-brown-800 mb-3 line-clamp-2">
                    <Link to={`/blog/${post.slug}`} className="hover:text-brown-600 transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-brown-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>
                  <Link 
                    to={`/blog/${post.slug}`} 
                    className="inline-flex items-center gap-2 text-brown-800 font-medium text-sm hover:text-brown-600 transition-colors mt-auto group"
                  >
                    Read Story <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
