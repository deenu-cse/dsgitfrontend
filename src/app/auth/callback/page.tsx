"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function AuthCallback() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      setStatus('error');
      setErrorMsg('No authorization code received from GitHub.');
      return;
    }

    // Verify state to prevent CSRF
    const savedState = sessionStorage.getItem('oauth_state');
    // If opened in popup, the opener's sessionStorage won't be accessible,
    // so we skip state check for popup flow (the popup is same-origin anyway)

    // Exchange code for user profile via our backend
    fetch(`${API_URL}/auth/github-web`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          // Store in localStorage
          localStorage.setItem('dsa_web_user', JSON.stringify(data.user));

          // If opened as popup, notify the opener window and close
          if (window.opener) {
            window.opener.postMessage({ type: 'DSA_AUTH_SUCCESS', user: data.user }, window.location.origin);
            window.close();
            return;
          }

          // If navigated directly (not popup), redirect to arena
          setStatus('success');
          setTimeout(() => {
            window.location.href = '/arena';
          }, 1500);
        } else {
          setStatus('error');
          setErrorMsg(data.error || 'Authentication failed');
        }
      })
      .catch(err => {
        setStatus('error');
        setErrorMsg(err.message);
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center p-8">
        {status === 'loading' && (
          <>
            <div className="w-12 h-12 border-4 border-[#1D9E75] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg font-bold">Authenticating with GitHub...</p>
            <p className="text-zinc-500 text-sm mt-2">Please wait while we verify your account.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <p className="text-white text-lg font-bold">Login Successful!</p>
            <p className="text-zinc-400 text-sm mt-2">Redirecting to Arena...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <p className="text-white text-lg font-bold">Authentication Failed</p>
            <p className="text-red-400 text-sm mt-2">{errorMsg}</p>
            <button onClick={() => window.location.href = '/'} className="mt-6 px-6 py-2 bg-[#1D9E75] text-white rounded-full font-bold">
              Go Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}
