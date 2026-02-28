import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { API_BASE } from '../lib/api';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin');
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full border border-brown-100">
        <div className="flex justify-center mb-6 text-brown-800">
          <div className="bg-brown-100 p-4 rounded-full">
            <Lock size={32} />
          </div>
        </div>
        <h1 className="text-2xl font-serif font-bold text-center text-brown-800 mb-6">Admin Login</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-sm mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brown-800 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-brown-200 p-3 rounded-sm focus:outline-none focus:border-brown-600"
              placeholder="Enter admin password"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-brown-800 text-cream-50 py-3 rounded-sm font-medium hover:bg-brown-600 transition-colors uppercase tracking-wider text-sm"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center text-xs text-brown-600/60">
          <p>Demo Password: admin123</p>
        </div>
      </div>
    </div>
  );
}
