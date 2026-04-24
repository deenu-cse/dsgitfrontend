"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

const sections = [
  {
    id: "overview",
    icon: "🛡️",
    title: "Overview",
    content: (
      <>
        <p>
          DsGit (&quot;we&quot;, &quot;our&quot;, &quot;the Extension&quot;) is a Chrome browser extension that
          automatically pushes your DSA (Data Structures &amp; Algorithms) solutions to
          GitHub, tracks your solving streak, and enables competitive battles with
          peers.
        </p>
        <p className="mt-3">
          We are committed to transparency. This Privacy Policy explains exactly what
          data we collect, why we collect it, where it is stored, and how you can
          delete it. We follow the principle of{" "}
          <strong className="text-[#1D9E75]">minimum data collection</strong> — we only
          touch data that is strictly necessary to provide the extension&apos;s features.
        </p>
        <p className="mt-3 text-zinc-400 text-sm">
          <strong>Effective date:</strong> April 24, 2025 &nbsp;·&nbsp;{" "}
          <strong>Extension version:</strong> 1.0.2
        </p>
      </>
    ),
  },
  {
    id: "data-collected",
    icon: "📦",
    title: "Data We Collect",
    content: (
      <>
        <p className="mb-4">
          The following table lists every piece of data the extension interacts with,
          where it lives, and why it is needed.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left py-3 pr-6 text-zinc-300 font-semibold">Data</th>
                <th className="text-left py-3 pr-6 text-zinc-300 font-semibold">Storage Location</th>
                <th className="text-left py-3 text-zinc-300 font-semibold">Purpose</th>
              </tr>
            </thead>
            <tbody className="text-zinc-400">
              {[
                {
                  data: "GitHub OAuth Access Token",
                  location: "chrome.storage.local (device only)",
                  purpose: "Authenticate API calls to create/push to your GitHub repo",
                },
                {
                  data: "GitHub Username, Avatar URL, GitHub User ID",
                  location: "chrome.storage.local + DsGit backend",
                  purpose: "Display your profile in the popup; identify you in battles",
                },
                {
                  data: "Target GitHub Repository Name",
                  location: "chrome.storage.local (device only)",
                  purpose: "Know which repo to push solutions into",
                },
                {
                  data: "Streak Data (current streak, longest streak, daily history, break dates)",
                  location: "chrome.storage.local (device only)",
                  purpose: "Power the streak tracker and daily reminder notifications",
                },
                {
                  data: "Push History (question name, platform, difficulty, language, date, day number, commit SHA)",
                  location: "chrome.storage.local (device only, max 500 entries)",
                  purpose: "Show recent submissions; build the GitHub README stats",
                },
                {
                  data: "Code Snapshots (your draft code + problem URL, timestamp)",
                  location: "chrome.storage.local (device only, max 10 snapshots)",
                  purpose: "Time-machine feature — lets you restore earlier drafts",
                },
                {
                  data: "Battle Records (battle ID, opponent username, type, status, duration)",
                  location: "chrome.storage.local + DsGit backend",
                  purpose: "Track active/completed competitive battles",
                },
                {
                  data: "Badges",
                  location: "chrome.storage.local (device only)",
                  purpose: "Display achievement badges in the popup",
                },
                {
                  data: "Signup Date",
                  location: "chrome.storage.local (device only)",
                  purpose: "Track how long you have been using the extension",
                },
                {
                  data: "Stats Cache (aggregated solve counts per platform/difficulty)",
                  location: "chrome.storage.local (device only)",
                  purpose: "Fast popup load without repeated API calls",
                },
              ].map((row, i) => (
                <tr key={i} className="border-b border-zinc-800/60 hover:bg-zinc-800/20 transition-colors">
                  <td className="py-3 pr-6 font-medium text-zinc-300 align-top">{row.data}</td>
                  <td className="py-3 pr-6 align-top text-xs">{row.location}</td>
                  <td className="py-3 align-top text-xs">{row.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-[#1D9E75]/10 border border-[#1D9E75]/30 rounded-xl text-sm text-zinc-300">
          <span className="text-[#1D9E75] font-bold">✅ We do NOT collect:</span>
          <ul className="mt-2 space-y-1 list-disc list-inside text-zinc-400">
            <li>Your full code solutions (these go directly to <em>your</em> GitHub repo)</li>
            <li>Browsing history outside the supported coding platforms</li>
            <li>Any data from pages that are not LeetCode, GeeksforGeeks, CodingNinjas, or Nados.io</li>
            <li>Passwords or payment information of any kind</li>
            <li>Analytics, telemetry, or crash reports beyond what the extension needs to function</li>
          </ul>
        </div>
      </>
    ),
  },
  {
    id: "permissions",
    icon: "🔐",
    title: "Chrome Permissions Explained",
    content: (
      <>
        <p className="mb-4">
          DsGit requests the following Chrome permissions. Each permission is justified
          below.
        </p>
        <div className="space-y-3">
          {[
            {
              perm: "storage",
              why: "Save your GitHub token, streak data, push history, and settings locally on your device using chrome.storage.local.",
            },
            {
              perm: "identity",
              why: "Launch the GitHub OAuth 2.0 sign-in flow securely using chrome.identity.launchWebAuthFlow.",
            },
            {
              perm: "notifications",
              why: "Send daily streak reminders (e.g., 'You haven't pushed today!') and battle event alerts.",
            },
            {
              perm: "alarms",
              why: "Schedule the daily reminder alarm and periodic battle-sync polling without requiring the popup to be open.",
            },
            {
              perm: "tabs",
              why: "Open LeetCode when you click 'Open LeetCode' in a reminder notification.",
            },
            {
              perm: "scripting",
              why: "Inject the content script that extracts your accepted solution code from the coding platform page when you click Push.",
            },
            {
              perm: "host_permissions — leetcode.com, geeksforgeeks.org, naukri.com (CodingNinjas), nados.io",
              why: "Read the problem page DOM to detect the question name, difficulty, language, and extract code from the Monaco/CodeMirror editor on these platforms only.",
            },
            {
              perm: "host_permissions — api.github.com",
              why: "Create repositories, push files (solutions + README + stats.json), and read your public profile via the GitHub REST API.",
            },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
              <div className="shrink-0 mt-0.5">
                <code className="text-[#1D9E75] text-xs bg-[#1D9E75]/10 px-2 py-0.5 rounded font-mono">
                  {item.perm}
                </code>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed">{item.why}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: "github",
    icon: "🐙",
    title: "GitHub Integration",
    content: (
      <>
        <p>
          When you click <strong className="text-white">Push Solution</strong>, the
          extension calls the{" "}
          <strong className="text-[#1D9E75]">GitHub REST API</strong> directly from
          your browser using your own OAuth token. The request goes{" "}
          <strong className="text-white">browser → github.com</strong> — your code
          never passes through our servers.
        </p>
        <p className="mt-3">
          The OAuth token is exchanged through a minimal{" "}
          <strong className="text-white">Cloudflare Worker proxy</strong> solely
          because GitHub requires a server-side secret to complete the OAuth code
          exchange. The proxy receives the one-time OAuth code, exchanges it for an
          access token with GitHub, and returns the token to your extension. The proxy
          stores nothing.
        </p>
        <p className="mt-3">
          We request the following GitHub OAuth scopes:{" "}
          <code className="text-[#1D9E75] bg-[#1D9E75]/10 px-1.5 py-0.5 rounded text-sm font-mono">
            repo
          </code>{" "}
          (create &amp; push to repos),{" "}
          <code className="text-[#1D9E75] bg-[#1D9E75]/10 px-1.5 py-0.5 rounded text-sm font-mono">
            user:email
          </code>{" "}
          (read your email for profile),{" "}
          <code className="text-[#1D9E75] bg-[#1D9E75]/10 px-1.5 py-0.5 rounded text-sm font-mono">
            read:user
          </code>{" "}
          (read your public GitHub profile). We do not request write access to other
          repos, organizations, or any scope beyond what is listed.
        </p>
      </>
    ),
  },
  {
    id: "backend",
    icon: "🖥️",
    title: "DsGit Backend & Real-Time Battles",
    content: (
      <>
        <p>
          To power the real-time <strong className="text-white">Battle Arena</strong>{" "}
          feature, the extension connects to our backend at{" "}
          <code className="text-[#1D9E75] bg-[#1D9E75]/10 px-1.5 py-0.5 rounded text-sm font-mono">
            api-dsgit.onrender.com
          </code>{" "}
          via HTTPS and WebSocket (WSS).
        </p>
        <p className="mt-3">
          The data sent to our backend is limited to:
        </p>
        <ul className="mt-2 space-y-1.5 list-disc list-inside text-zinc-400 text-sm">
          <li>
            <strong className="text-zinc-300">User sync</strong> — your GitHub ID,
            username, and avatar URL (sent once on login to register your account).
          </li>
          <li>
            <strong className="text-zinc-300">Battle activity</strong> — question name,
            platform, difficulty level, and battle ID when you push a solution during
            an active battle (so your score updates in real-time for your opponent).
          </li>
          <li>
            <strong className="text-zinc-300">Challenge events</strong> — sending or
            accepting a battle invite (your username, opponent username, battle type,
            duration).
          </li>
        </ul>
        <p className="mt-3 text-zinc-400 text-sm">
          Battle data is stored in our database only while a battle is active. We retain
          it for leaderboard and historical purposes unless you request deletion.
        </p>
      </>
    ),
  },
  {
    id: "third-party",
    icon: "🔗",
    title: "Third-Party Services",
    content: (
      <>
        <div className="space-y-4">
          {[
            {
              name: "GitHub (github.com / api.github.com)",
              detail:
                "Used for OAuth authentication and storing your solution files. Subject to GitHub's Privacy Policy.",
              link: "https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement",
            },
            {
              name: "Cloudflare Workers",
              detail:
                "A minimal server-side proxy to exchange the GitHub OAuth code for an access token. No data is logged or persisted by this worker.",
              link: "https://www.cloudflare.com/privacypolicy/",
            },
            {
              name: "DsGit Backend (Render.com)",
              detail:
                "Hosts our Node.js backend for the Battle Arena feature. Render may log standard infrastructure metrics (CPU, memory). No personally identifiable data beyond username is stored.",
              link: "https://render.com/privacy",
            },
          ].map((s, i) => (
            <div key={i} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
              <p className="font-semibold text-zinc-200 mb-1">{s.name}</p>
              <p className="text-zinc-400 text-sm">{s.detail}</p>
              <a
                href={s.link}
                target="_blank"
                rel="noreferrer"
                className="text-[#1D9E75] text-xs mt-1 inline-block hover:underline"
              >
                View their Privacy Policy →
              </a>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: "local-storage",
    icon: "💾",
    title: "Local Storage & Data Retention",
    content: (
      <>
        <p>
          The vast majority of your data is stored{" "}
          <strong className="text-white">locally on your device</strong> using{" "}
          <code className="text-[#1D9E75] bg-[#1D9E75]/10 px-1.5 py-0.5 rounded text-sm font-mono">
            chrome.storage.local
          </code>
          . This data never leaves your machine except when it is explicitly needed to
          call the GitHub API or our battle backend.
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { label: "OAuth Token", retention: "Until you log out" },
            { label: "User Profile", retention: "Until you log out" },
            { label: "Push History", retention: "Stored locally, max 500 entries" },
            { label: "Streak Data", retention: "Stored locally indefinitely" },
            { label: "Code Snapshots", retention: "Stored locally, max 10 snapshots" },
            { label: "Battle Records (backend)", retention: "Retained until you request deletion" },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm">
              <span className="text-zinc-300 font-medium">{item.label}</span>
              <span className="text-zinc-500 text-xs">{item.retention}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: "your-rights",
    icon: "⚖️",
    title: "Your Rights & Data Deletion",
    content: (
      <>
        <p>
          You have full control over your data:
        </p>
        <ul className="mt-3 space-y-3 text-zinc-400 text-sm">
          <li className="flex gap-3">
            <span className="text-[#1D9E75] text-base shrink-0">→</span>
            <span>
              <strong className="text-zinc-200">Log out anytime</strong> from the extension
              popup. This clears your GitHub token and profile from{" "}
              <code className="text-xs font-mono bg-zinc-800 px-1 py-0.5 rounded">chrome.storage.local</code>{" "}
              instantly.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#1D9E75] text-base shrink-0">→</span>
            <span>
              <strong className="text-zinc-200">Uninstall the extension</strong> to delete
              all locally stored data permanently.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#1D9E75] text-base shrink-0">→</span>
            <span>
              <strong className="text-zinc-200">Request backend deletion</strong> —
              contact us at the email below to request deletion of your account data
              (username, avatar URL, battle records) from our backend database.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#1D9E75] text-base shrink-0">→</span>
            <span>
              <strong className="text-zinc-200">Revoke GitHub access</strong> at any
              time from{" "}
              <a
                href="https://github.com/settings/applications"
                target="_blank"
                rel="noreferrer"
                className="text-[#1D9E75] hover:underline"
              >
                github.com/settings/applications
              </a>
              .
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "security",
    icon: "🔒",
    title: "Security",
    content: (
      <>
        <p>
          Your GitHub access token is stored using{" "}
          <code className="text-[#1D9E75] bg-[#1D9E75]/10 px-1.5 py-0.5 rounded text-sm font-mono">
            chrome.storage.local
          </code>
          , which is sandboxed to the extension and not accessible by web pages or
          other extensions. It is never transmitted to our servers.
        </p>
        <p className="mt-3">
          All communication with our backend and GitHub uses{" "}
          <strong className="text-white">HTTPS / WSS (TLS encrypted)</strong>{" "}
          connections. Our backend does not log or cache your GitHub token.
        </p>
        <p className="mt-3">
          The OAuth flow uses a{" "}
          <strong className="text-white">cryptographically random state parameter</strong>{" "}
          (via <code className="text-xs font-mono bg-zinc-800 px-1 py-0.5 rounded">crypto.randomUUID()</code>)
          to prevent CSRF attacks.
        </p>
      </>
    ),
  },
  {
    id: "children",
    icon: "👶",
    title: "Children's Privacy",
    content: (
      <p>
        DsGit is not directed at children under the age of 13. We do not knowingly
        collect personal information from children. If you believe a child has
        provided us with personal information, please contact us and we will delete it
        promptly.
      </p>
    ),
  },
  {
    id: "changes",
    icon: "📋",
    title: "Changes to This Policy",
    content: (
      <p>
        We may update this Privacy Policy from time to time. When we do, we will
        update the effective date at the top of this page. Significant changes will
        also be noted in the Chrome Web Store listing update notes. Continued use of
        the extension after changes constitutes acceptance of the updated policy.
      </p>
    ),
  },
  {
    id: "contact",
    icon: "✉️",
    title: "Contact Us",
    content: (
      <>
        <p>
          If you have questions, concerns, or data deletion requests, reach out at:
        </p>
        <div className="mt-4 p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
          <p className="text-zinc-300 font-semibold">DsGit — Privacy Inquiries</p>
          <p className="text-zinc-400 text-sm mt-1">
            GitHub:{" "}
            <a
              href="https://github.com/deenu-cse"
              target="_blank"
              rel="noreferrer"
              className="text-[#1D9E75] hover:underline"
            >
              github.com/deenu-cse
            </a>
          </p>
          <p className="text-zinc-400 text-sm mt-1">
            We aim to respond to all privacy requests within{" "}
            <strong className="text-zinc-300">7 business days</strong>.
          </p>
        </div>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1D9E75]/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 pt-16 pb-12 text-center relative">
          <div className="inline-flex items-center gap-2 bg-[#1D9E75]/10 border border-[#1D9E75]/30 text-[#1D9E75] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            🛡️ Privacy Policy
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter font-[var(--font-space-grotesk)] leading-none">
            <span className="text-[#1D9E75]">YOUR DATA,</span>
            <br />
            <span className="text-white">YOUR CONTROL</span>
          </h1>
          <p className="text-base md:text-lg text-zinc-400 mt-6 max-w-xl mx-auto leading-relaxed">
            DsGit is built by developers, for developers. We believe you should know
            exactly what data the extension touches — nothing more, nothing less.
          </p>
          <p className="text-zinc-600 text-sm mt-4">
            Last updated: April 24, 2025 &nbsp;·&nbsp; Version 1.0.2
          </p>
        </div>
      </section>

      {/* Table of contents */}
      <section className="max-w-4xl mx-auto px-4 pb-10">
        <div className="bg-[#111] border border-zinc-800 rounded-2xl p-6">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4 font-semibold">
            Table of Contents
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-[#1D9E75] transition-colors py-1"
              >
                <span>{s.icon}</span>
                <span>{s.title}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="max-w-4xl mx-auto px-4 pb-24 space-y-6">
        {sections.map((s) => (
          <div
            key={s.id}
            id={s.id}
            className="bg-[#111] border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-colors scroll-mt-24"
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">{s.icon}</span>
              <h2 className="text-xl font-black font-[var(--font-space-grotesk)]">
                {s.title}
              </h2>
            </div>
            <div className="text-zinc-400 text-sm leading-relaxed">{s.content}</div>
          </div>
        ))}
      </section>

      {/* Footer CTA */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-gradient-to-r from-[#1D9E75]/10 to-transparent border border-[#1D9E75]/20 rounded-2xl p-8 text-center">
          <p className="text-zinc-300 text-sm leading-relaxed max-w-lg mx-auto">
            DsGit is open-source. You can inspect every line of code that runs in your
            browser. We believe in earning trust through transparency.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-[#1D9E75] to-[#0f6b4e] rounded-full font-bold text-white text-sm shadow-lg shadow-[#1D9E75]/20 hover:scale-105 transition-transform"
            >
              ← Back to Home
            </Link>
            <a
              href="https://chrome.google.com/webstore"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-transparent border border-zinc-700 text-zinc-400 rounded-full font-bold text-sm hover:border-zinc-500 hover:text-white transition-colors"
            >
              Install the Extension
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 text-center text-zinc-600 text-sm">
        <p>
          Built for the DSA community.{" "}
          <a href="https://github.com/deenu-cse" className="text-[#1D9E75] hover:underline">
            GitHub
          </a>{" "}
          ·{" "}
          <Link href="/privacy" className="text-[#1D9E75] hover:underline">
            Privacy Policy
          </Link>{" "}
          ·{" "}
          <a href="https://chrome.google.com/webstore" className="text-[#1D9E75] hover:underline">
            Install Extension
          </a>
        </p>
      </footer>
    </div>
  );
}
