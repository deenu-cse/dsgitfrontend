const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-dsgit.onrender.com';

export async function fetchFromApi(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'API request failed');
  }
  return res.json();
}

export const getBattleWall = () => fetchFromApi('/battles/wall');
export const getOpenBattles = () => fetchFromApi('/battles/open');
export const getBattleById = (id: string) => fetchFromApi(`/battles/${id}`);
export const createBattle = (data: any) => fetchFromApi('/battles/create', { method: 'POST', body: JSON.stringify(data) });
export const acceptBattle = (id: string, data: any) => fetchFromApi(`/battles/${id}/accept`, { method: 'POST', body: JSON.stringify(data) });
export const closeJoining = (id: string, data: any) => fetchFromApi(`/battles/${id}/close-joining`, { method: 'POST', body: JSON.stringify(data) });
export const getUserPublicStats = (username: string) => fetchFromApi(`/users/${username}/public-stats`);
