import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  Menu,
  X,
  Heart,
  Search,
  User,
  Instagram,
  Facebook,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "motion/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  //Branding State Inside Component
  const [branding, setBranding] = useState<any>(null);

  useEffect(() => {
    fetch("/api/content/site_branding")
      .then((res) => res.json())
      .then((data) => setBranding(data))
      .catch(() => setBranding(null));
  }, []);

  const isHome = location.pathname === "/";

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "newsletter",
          email: email,
          details: { source: "footer" },
        }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-brown-800 bg-cream-50">
      {/* Announcement Bar */}
      <div className="bg-brown-600 text-cream-100 text-xs py-2 text-center tracking-wide">
        Free Shipping on Orders Above ₹999 | Empowering Rural Women Artisans
      </div>

      {/* Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${isHome && !isMenuOpen ? "bg-cream-50/90 backdrop-blur-md shadow-sm" : "bg-cream-50 shadow-sm"}`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-brown-800"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center">
            {branding?.logo ? (
              <img
                src={branding.logo}
                alt="SEWA Goatique"
                className="object-contain"
                style={{
                  height:
                    window.innerWidth >= 768
                      ? `${branding.logoHeightDesktop || 48}px`
                      : `${branding.logoHeightMobile || 40}px`,
                }}
              />
            ) : (
              <span className="text-2xl md:text-3xl font-serif font-bold text-brown-800 tracking-tight">
                SEWA{" "}
                <span className="text-brown-600 font-light italic">
                  Goatique
                </span>
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium uppercase tracking-wider text-brown-600">
            <Link to="/" className="hover:text-brown-800 transition-colors">
              Home
            </Link>
            <Link to="/shop" className="hover:text-brown-800 transition-colors">
              Shop
            </Link>
            <Link
              to="/about"
              className="hover:text-brown-800 transition-colors"
            >
              Our Story
            </Link>
            <Link
              to="/impact"
              className="hover:text-brown-800 transition-colors"
            >
              Impact
            </Link>
            <Link to="/blog" className="hover:text-brown-800 transition-colors">
              Journal
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:text-brown-600 transition-colors hidden md:block">
              <Search size={20} />
            </button>
            <Link
              to="/admin"
              className="p-2 hover:text-brown-600 transition-colors hidden md:block"
            >
              <User size={20} />
            </Link>
            <Link
              to="/cart"
              className="p-2 hover:text-brown-600 transition-colors relative"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-brown-600 text-cream-50 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-cream-50 border-t border-brown-100 overflow-hidden"
            >
              <nav className="flex flex-col p-4 gap-4 text-sm font-medium uppercase tracking-wider text-brown-600">
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2 border-b border-brown-100"
                >
                  Home
                </Link>
                <Link
                  to="/shop"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2 border-b border-brown-100"
                >
                  Shop
                </Link>
                <Link
                  to="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2 border-b border-brown-100"
                >
                  Our Story
                </Link>
                <Link
                  to="/impact"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2 border-b border-brown-100"
                >
                  Impact
                </Link>
                <Link
                  to="/blog"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2 border-b border-brown-100"
                >
                  Journal
                </Link>
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2 border-b border-brown-100"
                >
                  Admin
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-brown-800 text-cream-100 pt-16 pb-8">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-serif font-bold mb-6">
              SEWA Goatique
            </h3>
            <p className="text-cream-100/80 text-sm leading-relaxed mb-6">
              Handmade goat milk skincare crafted by rural women artisans. Pure,
              ethical, and empowering.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gold-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-gold-400 transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-serif font-medium mb-6 text-gold-400">
              Shop
            </h4>
            <ul className="space-y-3 text-sm text-cream-100/80">
              <li>
                <Link
                  to="/shop"
                  className="hover:text-cream-50 transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=Soaps"
                  className="hover:text-cream-50 transition-colors"
                >
                  Goat Milk Soaps
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=Body Care"
                  className="hover:text-cream-50 transition-colors"
                >
                  Body Butters
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=Face Care"
                  className="hover:text-cream-50 transition-colors"
                >
                  Face Care
                </Link>
              </li>
              <li>
                <Link
                  to="/bulk"
                  className="hover:text-cream-50 transition-colors"
                >
                  Bulk & CSR Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-serif font-medium mb-6 text-gold-400">
              Support
            </h4>
            <ul className="space-y-3 text-sm text-cream-100/80">
              <li>
                <Link
                  to="/track-order"
                  className="hover:text-cream-50 transition-colors"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping-policy"
                  className="hover:text-cream-50 transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="hover:text-cream-50 transition-colors"
                >
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-cream-50 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-cream-50 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-serif font-medium mb-6 text-gold-400">
              Stay Connected
            </h4>
            <p className="text-cream-100/80 text-sm mb-4">
              Subscribe for skincare tips and impact stories.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col gap-3"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="bg-brown-800 border border-cream-100/20 px-4 py-2 text-sm text-cream-50 focus:outline-none focus:border-gold-400 rounded-sm"
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="bg-gold-500 text-brown-800 px-4 py-2 text-sm font-medium uppercase tracking-wider hover:bg-gold-400 transition-colors rounded-sm"
              >
                {status === "submitting" ? "Subscribing..." : "Subscribe"}
              </button>
              {status === "success" && (
                <p className="text-green-400 text-xs">
                  Subscribed successfully!
                </p>
              )}
              {status === "error" && (
                <p className="text-red-400 text-xs">Failed to subscribe.</p>
              )}
            </form>
          </div>
        </div>

        <div className="container mx-auto px-4 border-t border-cream-100/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-cream-100/60">
          <p>
            &copy; {new Date().getFullYear()} SEWA Goatique. All rights
            reserved.
          </p>
          <div className="flex gap-4">
            <span>Secure Payments</span>
            <span>•</span>
            <span>100% Natural</span>
            <span>•</span>
            <span>Cruelty Free</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
