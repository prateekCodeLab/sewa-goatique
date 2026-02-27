import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import SEO from '../components/SEO';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string;
  author: string;
  published: boolean;
  created_at: string;
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts/${slug}`)
      .then(res => res.json())
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch post', err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-brown-800 font-serif text-xl">Loading Story...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center text-brown-800">
        <h1 className="text-3xl font-serif font-bold mb-4">Post Not Found</h1>
        <Link to="/blog" className="text-brown-600 hover:text-brown-800 underline">
          Back to Journal
        </Link>
      </div>
    );
  }

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.image,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "SEWA Goatique",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sewagoatique.com/logo.png"
      }
    },
    "datePublished": post.created_at,
    "description": post.excerpt
  });

  return (
    <div className="bg-cream-50 min-h-screen pb-20">
      <SEO 
        title={post.title} 
        description={post.excerpt}
        image={post.image}
        schema={schema}
      />

      {/* Hero Image */}
      {post.image && (
        <div className="w-full h-[60vh] relative">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-end">
            <div className="container mx-auto px-4 pb-12 text-white">
              <Link to="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
                <ArrowLeft size={20} /> Back to Journal
              </Link>
              <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 drop-shadow-lg max-w-4xl">
                {post.title}
              </h1>
              <div className="flex items-center gap-6 text-sm font-medium uppercase tracking-wider text-white/90">
                <span className="flex items-center gap-2">
                  <Calendar size={16} />
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-2">
                  <User size={16} />
                  {post.author}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <article className="container mx-auto px-4 max-w-3xl py-12">
        {!post.image && (
          <div className="mb-12 border-b border-brown-200 pb-8">
            <Link to="/blog" className="inline-flex items-center gap-2 text-brown-600 hover:text-brown-800 mb-6 transition-colors">
              <ArrowLeft size={20} /> Back to Journal
            </Link>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brown-900 mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-6 text-sm font-medium uppercase tracking-wider text-brown-500">
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                {new Date(post.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-2">
                <User size={16} />
                {post.author}
              </span>
            </div>
          </div>
        )}

        <div className="prose prose-brown prose-lg max-w-none font-serif text-brown-800 leading-relaxed">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {/* Share / Footer */}
        <div className="mt-16 pt-8 border-t border-brown-200 flex justify-between items-center">
          <Link to="/blog" className="text-brown-600 hover:text-brown-800 font-medium flex items-center gap-2">
            <ArrowLeft size={18} /> More Stories
          </Link>
          <div className="flex gap-4">
            {/* Social Share buttons could go here */}
          </div>
        </div>
      </article>
    </div>
  );
}
