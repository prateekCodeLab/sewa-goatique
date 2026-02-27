import React, { useEffect, useState } from "react";
import {
  Package,
  Users,
  Settings,
  Plus,
  LayoutDashboard,
  ShoppingBag,
  X,
  LogOut,
  Check,
  Trash2,
  FileText,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddPost, setShowAddPost] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    category: "Soaps",
    stock: "",
    images: "",
  });

  const [newPost, setNewPost] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    image: "",
    author: "Admin",
    published: true,
  });

  // CMS State
  const [homepageContent, setHomepageContent] = useState({
    headline: "",
    subheadline: "",
    cta_text: "",
  });
  const [cmsStatus, setCmsStatus] = useState("");

  //Branding State
  const [brandingContent, setBrandingContent] = useState({
    logo: "",
    favicon: "",
    heroImage: "",
    logoHeightDesktop: 48, // px
    logoHeightMobile: 40, // px
  });

  const navigate = useNavigate();

  const fetchData = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Failed to fetch orders", err));

    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Failed to fetch products", err));

    fetch("/api/messages")
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Failed to fetch messages", err));

    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Failed to fetch posts", err));

    fetch("/api/content/homepage_hero")
      .then((res) => res.json())
      .then((data) => {
        if (data.headline) setHomepageContent(data);
      })
      .catch((err) => console.error("Failed to fetch content", err));
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    fetch("/api/content/site_branding")
      .then((res) => res.json())
      .then((data) => {
        if (data) setBrandingContent(data);
      })
      .catch((err) => console.error("Failed to fetch branding", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    setIsUploading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        // Append to existing images or set as new
        const currentImages = newProduct.images
          ? newProduct.images
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];
        currentImages.push(data.url);
        setNewProduct({ ...newProduct, images: currentImages.join(", ") });
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleBrandingUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logo" | "favicon" | "heroImage",
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!data.url) return;

      const updatedBranding = {
        ...brandingContent,
        [field]: data.url,
      };

      await fetch("/api/content/site_branding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ value: updatedBranding }),
      });

      setBrandingContent(updatedBranding);
    } catch (err) {
      console.error("Branding upload failed", err);
    }
  };

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setCmsStatus("saving");
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/content/homepage_hero", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ value: homepageContent }),
      });
      if (res.ok) {
        setCmsStatus("saved");
        setTimeout(() => setCmsStatus(""), 2000);
      } else {
        setCmsStatus("error");
      }
    } catch (err) {
      setCmsStatus("error");
    }
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newPost,
          slug:
            newPost.slug ||
            newPost.title
              .toLowerCase()
              .replace(/ /g, "-")
              .replace(/[^\w-]+/g, ""),
        }),
      });
      if (res.ok) {
        setShowAddPost(false);
        setNewPost({
          title: "",
          slug: "",
          content: "",
          excerpt: "",
          image: "",
          author: "Admin",
          published: true,
        });
        fetchData();
      } else {
        alert("Failed to add post");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newProduct,
          slug:
            newProduct.slug || newProduct.name.toLowerCase().replace(/ /g, "-"),
          images: newProduct.images.split(",").map((url) => url.trim()),
        }),
      });
      if (res.ok) {
        setShowAddProduct(false);
        setNewProduct({
          name: "",
          slug: "",
          description: "",
          price: "",
          category: "Soaps",
          stock: "",
          images: "",
        });
        fetchData();
      } else {
        alert("Failed to add product");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOrderStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-brown-800 text-cream-50 flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-brown-700">
          <h2 className="text-2xl font-serif font-bold">SEWA Admin</h2>
        </div>
        <nav className="flex-grow py-4">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-brown-600 transition-colors ${activeTab === "dashboard" ? "bg-brown-600 border-l-4 border-gold-400" : "border-l-4 border-transparent"}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-brown-600 transition-colors ${activeTab === "orders" ? "bg-brown-600 border-l-4 border-gold-400" : "border-l-4 border-transparent"}`}
          >
            <ShoppingBag size={20} /> Orders
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-brown-600 transition-colors ${activeTab === "products" ? "bg-brown-600 border-l-4 border-gold-400" : "border-l-4 border-transparent"}`}
          >
            <Package size={20} /> Products
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-brown-600 transition-colors ${activeTab === "messages" ? "bg-brown-600 border-l-4 border-gold-400" : "border-l-4 border-transparent"}`}
          >
            <Users size={20} /> Messages
          </button>
          <button
            onClick={() => setActiveTab("cms")}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-brown-600 transition-colors ${activeTab === "cms" ? "bg-brown-600 border-l-4 border-gold-400" : "border-l-4 border-transparent"}`}
          >
            <FileText size={20} /> Site Content
          </button>
          <button
            onClick={() => setActiveTab("blog")}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-brown-600 transition-colors ${activeTab === "blog" ? "bg-brown-600 border-l-4 border-gold-400" : "border-l-4 border-transparent"}`}
          >
            <FileText size={20} /> Blog
          </button>
        </nav>
        <div className="p-4 border-t border-brown-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-left text-red-300 hover:text-red-100 hover:bg-brown-700 rounded-sm transition-colors"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 ml-64 overflow-y-auto min-h-screen">
        {activeTab === "dashboard" && (
          <div className="animate-in fade-in duration-500">
            <h1 className="text-3xl font-serif font-bold text-gray-800 mb-8">
              Dashboard Overview
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-gray-500 text-sm uppercase tracking-wide font-medium mb-2">
                  Total Sales
                </h3>
                <p className="text-3xl font-bold text-gray-800">
                  ₹{orders.reduce((sum, order) => sum + order.total_amount, 0)}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-gray-500 text-sm uppercase tracking-wide font-medium mb-2">
                  Total Orders
                </h3>
                <p className="text-3xl font-bold text-gray-800">
                  {orders.length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-gray-500 text-sm uppercase tracking-wide font-medium mb-2">
                  Products
                </h3>
                <p className="text-3xl font-bold text-gray-800">
                  {products.length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-gray-500 text-sm uppercase tracking-wide font-medium mb-2">
                  Messages
                </h3>
                <p className="text-3xl font-bold text-gray-800">
                  {messages.length}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-800">Recent Orders</h3>
              </div>
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-800 font-medium border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3">Order ID</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Total</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-3">#{order.id}</td>
                      <td className="px-6 py-3">{order.customer_name}</td>
                      <td className="px-6 py-3">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3">₹{order.total_amount}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-serif font-bold text-gray-800">
                Products
              </h1>
              <button
                onClick={() => setShowAddProduct(true)}
                className="bg-brown-800 text-cream-50 px-4 py-2 rounded-sm flex items-center gap-2 hover:bg-brown-600 transition-colors shadow-sm"
              >
                <Plus size={18} /> Add Product
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-800 font-medium border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3">Image</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Stock</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-sm overflow-hidden border border-gray-200">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-3 font-medium text-gray-800">
                        {product.name}
                      </td>
                      <td className="px-6 py-3">{product.category}</td>
                      <td className="px-6 py-3">₹{product.price}</td>
                      <td className="px-6 py-3">{product.stock}</td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="animate-in fade-in duration-500">
            <h1 className="text-3xl font-serif font-bold text-gray-800 mb-8">
              All Orders
            </h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-800 font-medium border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3">Order ID</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Total</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-3">#{order.id}</td>
                      <td className="px-6 py-3">
                        <div className="font-medium text-gray-800">
                          {order.customer_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.customer_email}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3">₹{order.total_amount}</td>
                      <td className="px-6 py-3">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleUpdateOrderStatus(order.id, e.target.value)
                          }
                          className={`px-2 py-1 rounded-full text-xs font-medium border-none focus:ring-2 focus:ring-offset-1 cursor-pointer ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-800 focus:ring-green-500"
                              : order.status === "cancelled"
                                ? "bg-red-100 text-red-800 focus:ring-red-500"
                                : "bg-yellow-100 text-yellow-800 focus:ring-yellow-500"
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-3">
                        <button className="text-blue-600 hover:underline text-xs">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="animate-in fade-in duration-500">
            <h1 className="text-3xl font-serif font-bold text-gray-800 mb-8">
              Messages
            </h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-800 font-medium border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {messages.map((msg) => (
                    <tr key={msg.id}>
                      <td className="px-6 py-3 capitalize font-medium">
                        {msg.type}
                      </td>
                      <td className="px-6 py-3">{msg.name || "-"}</td>
                      <td className="px-6 py-3">{msg.email}</td>
                      <td className="px-6 py-3">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </td>
                      <td
                        className="px-6 py-3 max-w-xs truncate"
                        title={JSON.stringify(msg.details)}
                      >
                        {msg.details.message || msg.details.company || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "cms" && (
          <div className="animate-in fade-in duration-500">
            <h1 className="text-3xl font-serif font-bold text-gray-800 mb-8">
              Content Management
            </h1>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-2xl">
              <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">
                Homepage Hero Section
              </h2>
              <form onSubmit={handleSaveContent} className="space-y-6">
                <div className="mt-12 border-t pt-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">
                    Site Branding
                  </h2>

                  <div className="space-y-6">
                    {/* Logo Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleBrandingUpload(e, "logo")}
                      />
                      {brandingContent.logo && (
                        <img
                          src={brandingContent.logo}
                          className="h-12 mt-3 object-contain"
                        />
                      )}
                    </div>

                    {/* Favicon Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Favicon
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleBrandingUpload(e, "favicon")}
                      />
                      {brandingContent.favicon && (
                        <img
                          src={brandingContent.favicon}
                          className="h-8 mt-3 object-contain"
                        />
                      )}
                    </div>

                    {/* Hero Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hero Background Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleBrandingUpload(e, "heroImage")}
                      />
                      {brandingContent.heroImage && (
                        <img
                          src={brandingContent.heroImage}
                          className="h-20 mt-3 object-cover"
                        />
                      )}
                    </div>

                    {/* Logo Size Controls */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Logo Height (Desktop px)
                        </label>
                        <input
                          type="number"
                          value={brandingContent.logoHeightDesktop}
                          onChange={(e) =>
                            setBrandingContent({
                              ...brandingContent,
                              logoHeightDesktop: Number(e.target.value),
                            })
                          }
                          className="w-full border border-gray-300 p-2 rounded-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Logo Height (Mobile px)
                        </label>
                        <input
                          type="number"
                          value={brandingContent.logoHeightMobile}
                          onChange={(e) =>
                            setBrandingContent({
                              ...brandingContent,
                              logoHeightMobile: Number(e.target.value),
                            })
                          }
                          className="w-full border border-gray-300 p-2 rounded-sm"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        const token = localStorage.getItem("adminToken");

                        await fetch("/api/content/site_branding", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({ value: brandingContent }),
                        });

                        alert("Branding updated!");
                      }}
                      className="mt-4 bg-brown-800 text-cream-50 px-4 py-2 rounded-sm"
                    >
                      Save Branding Settings
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={homepageContent.headline}
                    onChange={(e) =>
                      setHomepageContent({
                        ...homepageContent,
                        headline: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 p-2 rounded-sm focus:outline-none focus:border-brown-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sub-headline
                  </label>
                  <textarea
                    value={homepageContent.subheadline}
                    onChange={(e) =>
                      setHomepageContent({
                        ...homepageContent,
                        subheadline: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 p-2 rounded-sm focus:outline-none focus:border-brown-600"
                    rows={3}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={homepageContent.cta_text}
                    onChange={(e) =>
                      setHomepageContent({
                        ...homepageContent,
                        cta_text: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 p-2 rounded-sm focus:outline-none focus:border-brown-600"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={cmsStatus === "saving"}
                    className="bg-brown-800 text-cream-50 px-6 py-3 rounded-sm font-medium hover:bg-brown-600 transition-colors disabled:opacity-50"
                  >
                    {cmsStatus === "saving" ? "Saving..." : "Save Changes"}
                  </button>
                  {cmsStatus === "saved" && (
                    <span className="text-green-600 flex items-center gap-1">
                      <Check size={18} /> Saved!
                    </span>
                  )}
                  {cmsStatus === "error" && (
                    <span className="text-red-600">Failed to save.</span>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === "blog" && (
          <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-serif font-bold text-gray-800">
                Blog Posts
              </h1>
              <button
                onClick={() => setShowAddPost(true)}
                className="bg-brown-800 text-cream-50 px-4 py-2 rounded-sm flex items-center gap-2 hover:bg-brown-600 transition-colors shadow-sm"
              >
                <Plus size={18} /> Add Post
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-800 font-medium border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Author</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td className="px-6 py-3 font-medium text-gray-800">
                        {post.title}
                      </td>
                      <td className="px-6 py-3">{post.author}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${post.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                        >
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        {new Date(post.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold text-gray-800">
                Add Product
              </h2>
              <button
                onClick={() => setShowAddProduct(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded-sm focus:outline-none focus:border-brown-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded-sm focus:outline-none focus:border-brown-600"
                  rows={3}
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    className="w-full border border-gray-300 p-2 rounded-sm focus:outline-none focus:border-brown-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock: e.target.value })
                    }
                    className="w-full border border-gray-300 p-2 rounded-sm focus:outline-none focus:border-brown-600"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded-sm focus:outline-none focus:border-brown-600"
                >
                  <option>Soaps</option>
                  <option>Body Care</option>
                  <option>Face Care</option>
                  <option>Gift Sets</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Images
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="image-upload"
                    className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-sm cursor-pointer hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm"
                  >
                    <Upload size={16} />{" "}
                    {isUploading ? "Uploading..." : "Upload Image"}
                  </label>
                </div>
                <input
                  type="text"
                  value={newProduct.images}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, images: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded-sm focus:outline-none focus:border-brown-600 text-sm"
                  placeholder="Or enter image URLs separated by commas"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload images or paste external URLs.
                </p>
              </div>
              <button
                type="submit"
                className="w-full bg-brown-800 text-cream-50 py-3 rounded-sm font-medium hover:bg-brown-600 transition-colors"
              >
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Post Modal */}
      {showAddPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold text-gray-800">
                Add Blog Post
              </h2>
              <button
                onClick={() => setShowAddPost(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddPost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({ ...newPost, title: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded-sm focus:outline-none focus:border-brown-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt
                </label>
                <textarea
                  value={newPost.excerpt}
                  onChange={(e) =>
                    setNewPost({ ...newPost, excerpt: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded-sm focus:outline-none focus:border-brown-600"
                  rows={2}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({ ...newPost, content: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded-sm focus:outline-none focus:border-brown-600"
                  rows={6}
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (!e.target.files || e.target.files.length === 0)
                        return;
                      const file = e.target.files[0];
                      const formData = new FormData();
                      formData.append("image", file);
                      setIsUploading(true);
                      try {
                        const token = localStorage.getItem("adminToken");
                        const res = await fetch("/api/upload", {
                          method: "POST",
                          headers: { Authorization: `Bearer ${token}` },
                          body: formData,
                        });
                        const data = await res.json();
                        if (data.url)
                          setNewPost({ ...newPost, image: data.url });
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setIsUploading(false);
                      }
                    }}
                    className="hidden"
                    id="post-image-upload"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="post-image-upload"
                    className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-sm cursor-pointer hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm"
                  >
                    <Upload size={16} />{" "}
                    {isUploading ? "Uploading..." : "Upload Image"}
                  </label>
                </div>
                <input
                  type="text"
                  value={newPost.image}
                  onChange={(e) =>
                    setNewPost({ ...newPost, image: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded-sm focus:outline-none focus:border-brown-600 text-sm"
                  placeholder="Or enter image URL"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newPost.published}
                  onChange={(e) =>
                    setNewPost({ ...newPost, published: e.target.checked })
                  }
                  id="published"
                />
                <label
                  htmlFor="published"
                  className="text-sm font-medium text-gray-700"
                >
                  Published
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-brown-800 text-cream-50 py-3 rounded-sm font-medium hover:bg-brown-600 transition-colors"
              >
                Save Post
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
