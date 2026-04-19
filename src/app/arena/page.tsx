"use client";

import { useEffect, useState } from 'react';
import { getBattleWall, getOpenBattles } from '@/lib/api';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/lib/auth';
import { motion } from 'framer-motion';

export default function ArenaPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [battles, setBattles] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getBattleWall().catch(() => ({ wallData: {} })),
      getOpenBattles().catch(() => ({ battles: [] }))
    ]).then(([wallRes, battlesRes]) => {
      if (wallRes.wallData) setStats(wallRes.wallData);
      if (battlesRes.battles) setBattles(battlesRes.battles);
      setLoading(false);
    });
  }, []);

  const filters = [
    { key: 'all', label: '⚔️ All', color: 'from-blue-500 to-purple-500' },
    { key: 'active', label: '🔥 Active', color: 'from-green-500 to-emerald-500' },
    { key: 'sprint', label: '🏃 7-Day', color: 'from-amber-500 to-orange-500' },
    { key: 'streak', label: '📊 30-Day', color: 'from-purple-500 to-pink-500' },
    { key: 'open', label: '🌐 Open', color: 'from-blue-500 to-cyan-500' },
  ];

  const filteredBattles = battles.filter(b => {
    if (filter === 'all') return true;
    if (filter === 'open') return b.acceptingJoins;
    if (filter === 'active') return b.status === 'active';
    if (filter === 'streak') return b.type?.includes('30');
    if (filter === 'sprint') return b.type?.includes('7');
    return true;
  });

  const getTypeColor = (type: string) => {
    if (type?.includes('30')) return { bg: 'bg-purple-500/15', border: 'border-purple-500/30', text: 'text-purple-400', badge: 'bg-purple-500/20' };
    if (type?.includes('7')) return { bg: 'bg-green-500/15', border: 'border-green-500/30', text: 'text-green-400', badge: 'bg-green-500/20' };
    if (type?.includes('topic')) return { bg: 'bg-amber-500/15', border: 'border-amber-500/30', text: 'text-amber-400', badge: 'bg-amber-500/20' };
    return { bg: 'bg-blue-500/15', border: 'border-blue-500/30', text: 'text-blue-400', badge: 'bg-blue-500/20' };
  };

  const getStatusBadge = (battle: any) => {
    if (battle.status === 'active') return { text: '🔥 Live', color: 'text-green-400' };
    if (battle.status === 'won') return { text: '🏆 Won', color: 'text-yellow-400' };
    if (battle.status === 'lost') return { text: '💔 Lost', color: 'text-red-400' };
    return { text: '⏰ Pending', color: 'text-amber-400' };
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-2">
                BATTLE ARENA
              </h1>
              <p className="text-zinc-400 text-lg">Join epic DSA battles with coders worldwide 🌍⚔️</p>
            </div>
            <Link 
              href="/create" 
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-full shadow-lg hover:shadow-green-500/50 transition-all transform hover:scale-105"
            >
              ⚔️ Create Battle
            </Link>
          </div>

          {/* Live Stats Strip */}
          {stats && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              {[
                { value: stats.liveBattles || 0, label: '🔥 Live Battles', color: 'from-green-500 to-emerald-500' },
                { value: stats.totalFighters || 0, label: '👥 Fighters', color: 'from-blue-500 to-cyan-500' },
                { value: stats.openToJoin || 0, label: '🌐 Open Slots', color: 'from-purple-500 to-pink-500' },
                { value: stats.eliminatedToday || 0, label: '⚡ Eliminations', color: 'from-red-500 to-orange-500' },
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className={`bg-gradient-to-br ${stat.color} bg-opacity-5 border border-opacity-30 rounded-xl p-6 text-center backdrop-blur-sm`}
                >
                  <div className={`text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-zinc-500 uppercase tracking-widest mt-2 font-semibold">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Filter Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-2 mb-8 overflow-x-auto pb-4 scrollbar-hide"
        >
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all transform ${
                filter === f.key
                  ? `bg-gradient-to-r ${f.color} text-white shadow-lg scale-105`
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* Recent Winners Highlight */}
        {stats?.recentWinners?.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-10 space-y-3"
          >
            {stats.recentWinners.slice(0, 2).map((w: any, i: number) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-center gap-4 backdrop-blur-sm"
              >
                <span className="text-3xl animate-bounce">🏆</span>
                <div className="flex-1">
                  <span className="font-bold text-white text-lg">{w.winner}</span>
                  <span className="text-zinc-400"> just won the </span>
                  <span className="text-yellow-400 font-bold">{(w.type || '').replace(/-/g, ' ').toUpperCase()}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Battle Cards */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-zinc-500 text-lg">Loading battle arena...</p>
          </div>
        ) : filteredBattles.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {filteredBattles.map((b: any, idx: number) => {
              const joined = b.participants?.length || 1;
              const spotsLeft = (b.maxPlayers || 2) - joined;
              const colors = getTypeColor(b.type);
              const status = getStatusBadge(b);
              const daysLeft = b.status === 'active' ? Math.ceil((new Date(b.endDate).getTime() - new Date().getTime()) / 86400000) : null;

              return (
                <motion.div
                  key={b.battleId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className={`bg-gradient-to-br from-zinc-900 to-black border ${colors.border} rounded-xl p-6 backdrop-blur-sm hover:shadow-xl transition-all cursor-pointer group`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${colors.bg} border ${colors.border} flex items-center justify-center text-sm font-bold`}>
                        {b.challenger?.[0]?.toUpperCase() || '⚔️'}
                      </div>
                      <div>
                        <div className="font-bold text-white">{b.challenger || 'Anonymous'}</div>
                        <div className={`text-xs ${colors.text}`}>Battle Creator</div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${colors.badge} ${colors.text}`}>
                      {(b.type || '').replace(/-/g, ' ').toUpperCase()}
                    </div>
                  </div>

                  {/* Battle Type & Duration */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white mb-2">
                      {(b.type || '').split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Battle
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded">
                        ⏱️ {b.duration} Days
                      </span>
                      {b.status === 'active' && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                          🔥 {Math.max(0, daysLeft ?? 0)} days left
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Participants Grid */}
                  {b.leaderboard && b.leaderboard.length > 0 && (
                    <div className="mb-4 space-y-2">
                      <div className="text-xs text-zinc-500 font-semibold">📊 LEADERBOARD</div>
                      {b.leaderboard.slice(0, 3).map((p: any, idx: number) => {
                        const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
                        return (
                          <div key={p.username} className="flex items-center justify-between bg-zinc-900/50 p-2 rounded">
                            <div className="flex items-center gap-2">
                              <span>{medal}</span>
                              <span className="text-sm font-semibold text-white">{p.username}</span>
                            </div>
                            <span className="text-sm font-bold text-green-400">{p.score} pts</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Score Breakdown */}
                  {b.status === 'active' && (
                    <div className="mb-4 grid grid-cols-3 gap-2">
                      <div className="bg-red-500/10 border border-red-500/20 rounded p-2 text-center">
                        <div className="text-lg font-bold text-red-400">{b.hardSolved || 0}</div>
                        <div className="text-xs text-red-300">Hard</div>
                      </div>
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded p-2 text-center">
                        <div className="text-lg font-bold text-amber-400">{b.mediumSolved || 0}</div>
                        <div className="text-xs text-amber-300">Medium</div>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/20 rounded p-2 text-center">
                        <div className="text-lg font-bold text-green-400">{b.easySolved || 0}</div>
                        <div className="text-xs text-green-300">Easy</div>
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${status.color}`}>{status.text}</span>
                      <span className="text-xs text-zinc-500">
                        {b.isPublic ? `${joined}/${b.maxPlayers} joined` : 'Private 1v1'}
                      </span>
                    </div>
                    <Link
                      href={`/battle/${b.battleId}`}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                        spotsLeft > 0 && b.acceptingJoins && b.status === 'pending_invite'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/50'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                      }`}
                    >
                      {spotsLeft > 0 && b.acceptingJoins && b.status === 'pending_invite' ? '⚔️ Join' : 'View'}
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-gradient-to-br from-zinc-900/50 to-black border border-zinc-800 rounded-2xl"
          >
            <div className="text-6xl mb-4 animate-bounce">⚔️</div>
            <h3 className="text-2xl font-bold mb-3">The arena awaits...</h3>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">No active battles match your filter. Be the first to create one and challenge the community!</p>
            <Link 
              href="/create" 
              className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-8 py-3 rounded-full hover:shadow-lg hover:shadow-green-500/50 transition-all"
            >
              🚀 Create First Battle
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
