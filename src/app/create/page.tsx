"use client";

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { createBattle } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function CreateBattle() {
  const { user, login, loading: authLoading } = useAuth();
  const [type, setType] = useState('30-day-streak');
  const [duration, setDuration] = useState(14);
  const [isPublic, setIsPublic] = useState(false);
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [opponent, setOpponent] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<any>(null);
  const router = useRouter();

  const battleTypes = [
    { id: '30-day-streak', label: '30-Day Streak Duel', icon: '⚔️' },
    { id: '7-day-sprint', label: '7-Day Sprint', icon: '⚡' },
    { id: 'topic-master', label: 'Topic Master', icon: '🎯' },
    { id: 'difficulty-climber', label: 'Difficulty Climber', icon: '🏆' },
    { id: 'squad-battle', label: 'Squad Battle', icon: '👥' },
    { id: 'consistency-king', label: '90-Day Consistency King', icon: '🌙' },
  ];

  const durations = [7, 14, 30, 90];

  const handleCreate = async () => {
    if (!user) {
      login();
      return;
    }

    setLoading(true);
    try {
      const res = await createBattle({
        type,
        duration,
        isPublic,
        maxPlayers: isPublic ? maxPlayers : 2,
        opponentUsername: isPublic ? undefined : opponent || undefined,
        challengerUsername: user.username,
      });
      if (res.success) {
        setSuccess(res.battle);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create battle');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (success?.publicUrl) {
      navigator.clipboard.writeText(success.publicUrl);
      alert('Link copied!');
    }
  };

  // Show success card after creation
  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Navbar />
        <div className="max-w-lg mx-auto p-8 mt-20 text-center">
          <div className="bg-[#111] border border-[#1D9E75]/30 rounded-2xl p-8">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-black text-[#1D9E75] mb-2">Battle Created!</h2>
            <p className="text-zinc-400 text-sm mb-6">Share this link with your opponents</p>
            <div className="bg-zinc-900 rounded-lg p-3 text-sm text-zinc-300 break-all mb-4">
              {success.publicUrl || `${window.location.origin}/battle/${success.battleId}`}
            </div>
            <div className="flex gap-3">
              <button onClick={copyLink} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-full font-bold transition-colors">
                🔗 Copy Link
              </button>
              <button onClick={() => router.push(`/battle/${success.battleId}`)} className="flex-1 bg-[#1D9E75] hover:bg-[#147a59] text-white py-3 rounded-full font-bold transition-colors">
                View Battle →
              </button>
            </div>
            <button onClick={() => router.push('/arena')} className="mt-4 text-zinc-500 hover:text-white text-sm transition-colors">
              ← Back to Arena
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-black mb-2 text-[#1D9E75] font-[var(--font-space-grotesk)]">CREATE BATTLE</h1>
        <p className="text-zinc-500 mb-8">Set your terms and challenge the arena.</p>

        {/* Auth gate */}
        {!authLoading && !user && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 mb-8 text-center">
            <p className="text-amber-400 font-bold mb-3">⚠️ Login required to create battles</p>
            <button onClick={login} className="bg-white text-black font-bold px-6 py-2 rounded-full hover:bg-zinc-200 transition-colors">
              Login with GitHub
            </button>
          </div>
        )}

        <div className="space-y-8 bg-[#111] p-6 rounded-2xl border border-zinc-800">
          {/* Battle Type */}
          <div>
            <label className="block text-zinc-400 text-xs font-bold mb-3 uppercase tracking-widest">Battle Type</label>
            <div className="grid grid-cols-2 gap-3">
              {battleTypes.map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    setType(t.id);
                    if (t.id.includes('30')) setDuration(30);
                    else if (t.id.includes('7')) setDuration(7);
                    else if (t.id.includes('90')) setDuration(90);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all ${type === t.id ? 'border-[#1D9E75] bg-[#1D9E75]/10' : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'}`}
                >
                  <span className="text-xl">{t.icon}</span>
                  <div className="font-bold text-white text-sm mt-1">{t.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-zinc-400 text-xs font-bold mb-3 uppercase tracking-widest">Duration</label>
            <div className="flex gap-2">
              {durations.map(d => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`flex-1 py-3 rounded-full font-bold text-sm transition-all ${duration === d ? 'bg-[#1D9E75] text-white' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
                >
                  {d} days
                </button>
              ))}
            </div>
          </div>

          {/* Public toggle */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setIsPublic(!isPublic)}
                className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${isPublic ? 'bg-[#1D9E75]' : 'bg-zinc-700'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${isPublic ? 'left-6' : 'left-0.5'}`} />
              </div>
              <span className="text-white font-medium">Make it public — anyone can join</span>
            </label>
          </div>

          {/* Max players (if public) */}
          {isPublic && (
            <div>
              <label className="block text-zinc-400 text-xs font-bold mb-3 uppercase tracking-widest">Max Players: {maxPlayers}</label>
              <input
                type="range" min="2" max="20" value={maxPlayers}
                onChange={e => setMaxPlayers(parseInt(e.target.value))}
                className="w-full accent-[#1D9E75]"
              />
            </div>
          )}

          {/* Opponent (if private) */}
          {!isPublic && (
            <div>
              <label className="block text-zinc-400 text-xs font-bold mb-3 uppercase tracking-widest">Opponent GitHub Username</label>
              <input
                type="text" value={opponent} onChange={e => setOpponent(e.target.value)}
                placeholder="e.g. octocat"
                className="w-full bg-transparent border-b-2 border-zinc-700 text-white py-2 px-1 focus:border-[#1D9E75] outline-none transition-colors placeholder:text-zinc-600"
              />
            </div>
          )}

          {/* Scoring preview */}
          <div className="bg-zinc-900/50 rounded-xl p-4">
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3">Scoring System</div>
            <div className="flex gap-4 text-center">
              <div className="flex-1">
                <div className="text-red-400 font-black text-lg">3 pts</div>
                <div className="text-zinc-500 text-xs">Hard</div>
              </div>
              <div className="flex-1">
                <div className="text-amber-400 font-black text-lg">2 pts</div>
                <div className="text-zinc-500 text-xs">Medium</div>
              </div>
              <div className="flex-1">
                <div className="text-green-400 font-black text-lg">1 pt</div>
                <div className="text-zinc-500 text-xs">Easy</div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleCreate}
            disabled={loading || (!isPublic && !opponent)}
            className="w-full bg-gradient-to-r from-[#1D9E75] to-[#0f6b4e] text-white font-black py-4 rounded-full disabled:opacity-40 hover:shadow-lg hover:shadow-[#1D9E75]/20 transition-all text-lg"
          >
            {loading ? 'Creating...' : 'Create Battle 🔥'}
          </button>
        </div>
      </div>
    </div>
  );
}
