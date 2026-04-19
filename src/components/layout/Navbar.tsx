"use client";

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useState } from 'react';

export default function Navbar() {
  const { user, login, logout, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0a0a]/80 border-b border-zinc-800/50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#1D9E75] font-black text-xl tracking-tight font-[var(--font-space-grotesk)]">DSA TRACKER</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/arena" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">Arena</Link>
          <Link href="/create" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">Create Battle</Link>

          {loading ? (
            <div className="w-20 h-8 bg-zinc-800 rounded-full animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-zinc-900 rounded-full px-3 py-1.5">
                <img src={user.avatar_url} alt={user.username} className="w-6 h-6 rounded-full" />
                <span className="text-sm font-medium text-white">{user.username}</span>
              </div>
              <button onClick={logout} className="text-xs text-zinc-500 hover:text-red-400 transition-colors">Logout</button>
            </div>
          ) : (
            <button
              onClick={login}
              className="bg-[#1D9E75] hover:bg-[#147a59] text-white text-sm font-bold px-5 py-2 rounded-full transition-colors"
            >
              Login with GitHub
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white text-2xl">
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-[#0a0a0a] px-4 pb-4 space-y-3">
          <Link href="/arena" className="block py-2 text-zinc-400 hover:text-white" onClick={() => setMobileOpen(false)}>Arena</Link>
          <Link href="/create" className="block py-2 text-zinc-400 hover:text-white" onClick={() => setMobileOpen(false)}>Create Battle</Link>
          {user ? (
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <img src={user.avatar_url} alt={user.username} className="w-6 h-6 rounded-full" />
                <span className="text-sm text-white">{user.username}</span>
              </div>
              <button onClick={() => { logout(); setMobileOpen(false); }} className="text-xs text-red-400">Logout</button>
            </div>
          ) : (
            <button onClick={() => { login(); setMobileOpen(false); }} className="w-full bg-[#1D9E75] text-white font-bold py-2 rounded-full">
              Login with GitHub
            </button>
          )}
        </div>
      )}
    </nav>
  );
}