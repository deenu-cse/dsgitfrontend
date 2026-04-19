"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getBattleWall, getOpenBattles } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import Navbar from '@/components/layout/Navbar';

export default function LandingPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [liveBattles, setLiveBattles] = useState<any[]>([]);

  useEffect(() => {
    getBattleWall().then(d => setStats(d.wallData)).catch(() => { });
    getOpenBattles().then(d => setLiveBattles(d.battles?.slice(0, 3) || [])).catch(() => { });
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1D9E75]/5 via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto px-4 pt-20 pb-32 text-center relative">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter font-[var(--font-space-grotesk)] leading-none">
            <span className="text-[#1D9E75]">THE DSA</span><br />
            <span className="text-white">BATTLE ARENA</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mt-6 max-w-xl mx-auto leading-relaxed">
            Challenge friends. Track consistency. Auto-push to GitHub. Solve daily.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <a href="https://chrome.google.com/webstore" target="_blank" rel="noreferrer" className="px-8 py-4 bg-gradient-to-r from-[#1D9E75] to-[#0f6b4e] rounded-full font-bold text-white shadow-lg shadow-[#1D9E75]/20 hover:scale-105 transition-transform">
              Install Chrome Extension
            </a>
            <Link href="/arena" className="px-8 py-4 bg-transparent border-2 border-purple-500/50 text-purple-400 rounded-full font-bold hover:bg-purple-900/20 transition-colors">
              Explore Live Battles
            </Link>
          </div>

          {/* Live counters */}
          {stats && (
            <div className="flex justify-center gap-8 md:gap-16 mt-16">
              {[
                { val: stats.liveBattles || 0, label: 'Live Battles' },
                { val: stats.totalFighters || 0, label: 'Active Fighters' },
                { val: stats.openToJoin || 0, label: 'Open to Join' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-[#1D9E75]">{s.val}</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '⚔️', title: 'Battle System', desc: '6 challenge types. Private duels or open arena brawls with real-time tracking.' },
            { icon: '🔥', title: 'Streak Engine', desc: 'Duolingo for DSA. Track daily consistency. Break your streak = lose the battle.' },
            { icon: '📊', title: 'Deep Analytics', desc: 'Hard/Medium/Easy breakdowns. Platform stats across LeetCode, GFG, CodingNinjas.' },
          ].map((f, i) => (
            <div key={i} className="bg-[#111] border border-zinc-800 rounded-2xl p-8 text-center hover:border-zinc-700 transition-colors">
              <span className="text-4xl">{f.icon}</span>
              <h3 className="text-xl font-bold mt-4 mb-2">{f.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <h2 className="text-3xl font-black text-center mb-12 font-[var(--font-space-grotesk)]">HOW IT WORKS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Install Extension', desc: 'Add to Chrome, login with GitHub. Your tracking repo is auto-created.' },
            { step: '02', title: 'Solve DSA Questions', desc: 'Solve on LeetCode, GFG, or CodingNinjas. Solutions auto-push to GitHub.' },
            { step: '03', title: 'Challenge Friends', desc: 'Create battles on the Arena. First to break their streak loses.' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-5xl font-black text-[#1D9E75]/20 mb-2 font-[var(--font-space-grotesk)]">{s.step}</div>
              <h3 className="text-lg font-bold mb-2">{s.title}</h3>
              <p className="text-zinc-500 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black mb-3 font-[var(--font-space-grotesk)]">
            AUTO-PUSH STREAK TRACKER
          </h2>
          <p className="text-zinc-500 text-sm max-w-xl mx-auto">
            Solve on any platform. Auto-push to GitHub. Track every day.
          </p>
        </div>

        {/* 4-step flow */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { num: '01', title: 'Login', desc: 'GitHub OAuth in one click' },
            { num: '02', title: 'Solve', desc: 'LeetCode, GFG, CodingNinjas' },
            { num: '03', title: 'Auto-Push', desc: 'Code syncs instantly' },
            { num: '04', title: 'Track', desc: 'Streak builds every day' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-black text-[#1D9E75]/20 mb-2 font-[var(--font-space-grotesk)]">
                {s.num}
              </div>
              <h3 className="font-bold text-lg mb-1">{s.title}</h3>
              <p className="text-zinc-500 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Features — minimal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {[
            { icon: '⚡', title: 'Instant push on accept', desc: 'The moment you get Accepted — code is already in your GitHub.' },
            { icon: '📝', title: 'Auto-generated README', desc: 'Problem stats, difficulty, date — updated on every push automatically.' },
            { icon: '🔥', title: 'Streak tracking', desc: 'Current streak, longest streak, day counter. Miss a day — it shows.' },
            { icon: '📊', title: 'Contribution heatmap', desc: '30-day activity grid. Your GitHub goes from empty to proof of consistency.' },
          ].map((f, i) => (
            <div
              key={i}
              className="border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors"
            >
              <span className="text-2xl">{f.icon}</span>
              <h3 className="font-bold mt-3 mb-1 text-sm">{f.title}</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Platforms */}
        <div className="flex flex-wrap gap-3 justify-center mb-16">
          {[
            { name: 'LeetCode', emoji: '📘' },
            { name: 'GeeksforGeeks', emoji: '🐱' },
            { name: 'CodingNinjas', emoji: '🥷' },
          ].map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-2 border border-zinc-800 rounded-full px-5 py-2 text-sm"
            >
              <span>{p.emoji}</span>
              <span className="text-zinc-400 font-medium">{p.name}</span>
            </div>
          ))}
        </div>

        {/* Sample output */}
        <div className="border border-zinc-800 rounded-xl p-6">
          <p className="text-xs text-zinc-500 mb-4 uppercase tracking-widest">
            What gets pushed to GitHub
          </p>
          <div className="font-mono text-xs space-y-2 text-zinc-400">
            <div className="text-[#1D9E75]"># 🔥 DSA Solutions — deenu-cse</div>
            <div className="text-zinc-600">
              Auto-tracked · Streak: 🔥 14 days · Total: 47 problems
            </div>
            <div className="mt-3 space-y-1.5">
              <div>
                <span className="text-[#1D9E75]/60">Day 12</span>
                {"  "}
                <span className="text-zinc-300">TwoSum</span>
                {"  "}
                <span className="text-zinc-600">LeetCode · Easy</span>
              </div>
              <div>
                <span className="text-[#1D9E75]/60">Day 13</span>
                {"  "}
                <span className="text-zinc-300">LongestSubstring</span>
                {"  "}
                <span className="text-zinc-600">LeetCode · Medium</span>
              </div>
              <div>
                <span className="text-[#1D9E75]/60">Day 14</span>
                {"  "}
                <span className="text-zinc-300">LCA of Three Nodes</span>
                {"  "}
                <span className="text-zinc-600">CodingNinjas · Easy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live battles preview */}
      {liveBattles.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 pb-20">
          <h2 className="text-3xl font-black text-center mb-8 font-[var(--font-space-grotesk)]">LIVE BATTLES</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {liveBattles.map((b: any) => (
              <Link key={b.battleId} href={`/battle/${b.battleId}`} className="bg-[#111] border border-zinc-800 border-t-2 border-t-[#1D9E75] rounded-xl p-5 hover:bg-[#151515] transition-colors block">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold">
                    {b.challenger?.[0]?.toUpperCase()}
                  </div>
                  <span className="font-bold text-sm">{b.challenger}</span>
                </div>
                <div className="text-zinc-400 text-xs mb-3">{(b.type || '').replace(/-/g, ' ').toUpperCase()}</div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 text-xs">{b.participants?.length || 1} joined</span>
                  <span className="bg-[#1D9E75] text-white text-xs px-3 py-1 rounded-full font-bold">Join</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 text-center text-zinc-600 text-sm">
        <p>Built for the DSA community. <a href="https://github.com" className="text-[#1D9E75] hover:underline">GitHub</a> · <a href="https://chrome.google.com/webstore" className="text-[#1D9E75] hover:underline">Install Extension</a></p>
      </footer>
    </div>
  );
}
