"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getBattleById, acceptBattle, closeJoining } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import Navbar from '@/components/layout/Navbar';
import { useBattleWebSocket } from '@/lib/websocket';

export default function BattlePage() {
  const params = useParams();
  const id = params?.id as string;
  const { user, login } = useAuth();
  const [battle, setBattle] = useState<any>(null);
  const [loadingJoin, setLoadingJoin] = useState(false);
  const [copied, setCopied] = useState(false);

  const { activities, leaderboard, isConnected } = useBattleWebSocket(id, user?.username);

  useEffect(() => {
    if (id) {
      getBattleById(id).then(res => setBattle(res.battle)).catch(console.error);
    }
  }, [id]);

  const handleJoin = async () => {
    if (!user) {
      login();
      return;
    }
    setLoadingJoin(true);
    try {
      const res = await acceptBattle(id, { username: user.username });
      setBattle(res.battle);
    } catch (err: any) {
      alert("Failed to join: " + (err.message || err));
    } finally {
      setLoadingJoin(false);
    }
  };

  const handleCloseJoining = async () => {
    if (!user) return;
    try {
      const res = await closeJoining(id, { username: user.username });
      setBattle(res.battle);
    } catch (err: any) {
      alert(err.message || 'Failed');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!battle) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Navbar />
        <div className="flex items-center justify-center p-20">
          <div className="w-10 h-10 border-4 border-[#1D9E75] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const participants = battle.participants || [];
  const feed = activities.length > 0 ? activities : (battle.activityFeed || []);
  const isCreator = user?.username === battle.challenger;
  const isParticipant = participants.some((p: any) => p.username === user?.username);
  const daysLeft = battle.endDate ? Math.max(0, Math.ceil((new Date(battle.endDate).getTime() - Date.now()) / 86400000)) : battle.duration;
  const eliminated = participants.filter((p: any) => p.isEliminated).length;

  // Merge real-time leaderboard updates with static participants
  // This ensures scores are updated in real-time while keeping other participant data
  const mergedParticipants = participants.map((p: { username: any; }) => {
    const realtimeUpdate = leaderboard.find(l => l.username === p.username);
    return realtimeUpdate ? { ...p, ...realtimeUpdate } : p;
  });

  // Sort participants by score descending for leaderboard
  const sortedParticipants = [...mergedParticipants].sort((a: any, b: any) => (b.score || 0) - (a.score || 0));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto p-4 md:p-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              {(battle.type || '').replace(/-/g, ' ')}
            </span>
            {battle.isPublic && (
              <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Open Challenge</span>
            )}
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${battle.status === 'active' ? 'bg-green-500/20 text-green-400' : battle.status === 'won' ? 'bg-amber-500/20 text-amber-400' : 'bg-zinc-700/30 text-zinc-400'}`}>
              {battle.status}
            </span>
            {isConnected && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Live" />}
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-[#1D9E75] font-[var(--font-space-grotesk)]">
            {battle.challenger}&apos;s Battle
          </h1>
          <div className="flex flex-wrap gap-4 text-zinc-500 text-sm mt-4">
            <span>👥 {participants.length} joined</span>
            <span>📅 {daysLeft} days left</span>
            <span>🎯 {battle.maxPlayers} max</span>
            {eliminated > 0 && <span>💀 {eliminated} eliminated</span>}
          </div>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">

          {/* LEFT COLUMN */}
          <div className="space-y-6">

            {/* Creator Card */}
            <div className="bg-[#111] rounded-2xl p-6 border border-zinc-800">
              <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">Creator</div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#1D9E75]/20 flex items-center justify-center text-2xl font-black text-[#1D9E75]">
                  {battle.challenger?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="font-bold text-white text-lg">{battle.challenger}</div>
                  <div className="text-zinc-500 text-sm">Battle creator</div>
                </div>
              </div>
            </div>

            {/* Difficulty Breakdown */}
            <div className="bg-[#111] rounded-2xl p-6 border border-zinc-800">
              <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">Scoring System</div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                  <div className="text-red-400 font-black text-2xl">×3</div>
                  <div className="text-red-300 text-xs font-bold mt-1">Hard</div>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
                  <div className="text-amber-400 font-black text-2xl">×2</div>
                  <div className="text-amber-300 text-xs font-bold mt-1">Medium</div>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                  <div className="text-green-400 font-black text-2xl">×1</div>
                  <div className="text-green-300 text-xs font-bold mt-1">Easy</div>
                </div>
              </div>
              <div className="flex justify-between mt-4 text-xs text-zinc-500">
                <span>LeetCode</span><span>GeeksForGeeks</span><span>CodingNinjas</span>
              </div>
            </div>

            {/* Live Activity Feed */}
            <div className="bg-[#111] rounded-2xl p-6 border border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Live Activity Feed</div>
                {isConnected && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
              </div>
              {feed.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {feed.slice(0, 20).map((a: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-zinc-900/50 transition-colors">
                      <span className={a.difficulty === 'elimination' ? 'text-red-500' : 'text-green-500'}>
                        {a.difficulty === 'elimination' ? '💀' : '🟢'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-white text-sm">{a.username}</span>
                        <span className="text-zinc-400 text-sm"> solved </span>
                        <span className="text-zinc-300 text-sm">{a.questionName}</span>
                        <div className="flex gap-2 mt-1">
                          {a.platform && <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">{a.platform}</span>}
                          {a.difficulty && a.difficulty !== 'elimination' && (
                            <span className={`text-xs px-2 py-0.5 rounded ${a.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' : a.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`}>
                              {a.difficulty}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-600 text-sm text-center py-8">No activity yet. Start solving!</p>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">

            {/* Accept Challenge Box */}
            {battle.acceptingJoins && !isParticipant && (
              <div className="bg-[#1D9E75]/5 border-2 border-[#1D9E75]/30 rounded-2xl p-6 text-center">
                <h3 className="font-black text-xl text-white mb-2">Join this battle</h3>
                <p className="text-zinc-400 text-sm mb-6">Login with GitHub to accept the challenge.</p>
                <button
                  onClick={handleJoin}
                  disabled={loadingJoin}
                  className="w-full bg-gradient-to-r from-[#1D9E75] to-[#0f6b4e] text-white font-black py-4 rounded-full disabled:opacity-50 hover:shadow-lg hover:shadow-[#1D9E75]/20 transition-all text-lg"
                >
                  {loadingJoin ? 'Joining...' : '⚔️ Accept Challenge'}
                </button>
                <button onClick={handleCopyLink} className="mt-3 text-sm text-zinc-500 hover:text-white transition-colors">
                  {copied ? '✅ Link copied!' : '🔗 Copy battle link'}
                </button>
                <p className="text-zinc-600 text-xs mt-3">Creator can close joining anytime.</p>
              </div>
            )}

            {/* Creator controls */}
            {isCreator && battle.status === 'pending_invite' && (
              <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
                <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3">Creator Controls</div>
                <button
                  onClick={handleCloseJoining}
                  className={`w-full py-3 rounded-full font-bold text-sm transition-all ${battle.acceptingJoins ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-green-500/20 text-green-400'}`}
                >
                  {battle.acceptingJoins ? '🔒 Close Joining' : '✅ Joining Closed'}
                </button>
              </div>
            )}

            {/* Live Leaderboard */}
            <div className="bg-[#111] rounded-2xl p-6 border border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Live Leaderboard</div>
                {isConnected && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
              </div>

              {sortedParticipants.length > 0 ? (
                <div className="space-y-2">
                  {sortedParticipants.map((p: any, i: number) => {
                    const rankIcon = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
                    const isMe = user?.username === p.username;
                    return (
                      <div
                        key={p.username}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${p.isEliminated ? 'opacity-40 line-through' : ''} ${isMe ? 'bg-[#1D9E75]/10 border border-[#1D9E75]/20' : 'bg-zinc-900/50 hover:bg-zinc-900'}`}
                      >
                        <span className="text-lg w-8 text-center">{p.isEliminated ? '✗' : rankIcon}</span>
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-white">
                          {p.avatarInitial || p.username?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-white text-sm flex items-center gap-2">
                            {p.username}
                            {isMe && <span className="text-[10px] bg-[#1D9E75]/20 text-[#1D9E75] px-1.5 py-0.5 rounded font-bold">YOU</span>}
                          </div>
                          {p.currentStreak > 0 && <div className="text-orange-400 text-xs">🔥 {p.currentStreak} streak</div>}
                        </div>
                        <div className="text-right">
                          <div className="font-black text-white">{p.score || 0}</div>
                          <div className="text-zinc-600 text-xs">pts</div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Empty slots */}
                  {Array.from({ length: Math.max(0, battle.maxPlayers - participants.length) }).map((_, i) => (
                    <div key={`empty-${i}`} className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-zinc-800 opacity-30">
                      <span className="w-8 text-center text-zinc-600">—</span>
                      <div className="w-8 h-8 rounded-full border-2 border-dashed border-zinc-700" />
                      <span className="text-zinc-600 text-sm">Spot open</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-600 text-sm text-center py-8">No participants yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
