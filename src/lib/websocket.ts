"use client";

import { useEffect, useState, useRef, useCallback } from 'react';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://api-dsgit.onrender.com';

export function useBattleWebSocket(battleId?: string, username?: string) {
  const [activities, setActivities] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [winner, setWinner] = useState<any>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const backoffRef = useRef(1000);

  const connect = useCallback(() => {
    if (!username) return;
    
    // We pass the username to associate the WS connection
    const encodedUsername = encodeURIComponent(username);
    const wsUrl = `${WS_URL}?username=${encodedUsername}`;
    console.log('[WebSocket] Connecting to:', wsUrl);
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('[WebSocket] Connected as:', username);
      setIsConnected(true);
      backoffRef.current = 1000; // Reset backoff only on successful connection
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('[WebSocket] Received:', data.type);
        handleMessage(data);
      } catch (err) {
        console.error('WS message error:', err);
      }
    };

    ws.onclose = () => {
      console.log('[WebSocket] Disconnected. Reconnecting in', backoffRef.current, 'ms...');
      setIsConnected(false);
      // Auto reconnect with exponential backoff
      const delay = backoffRef.current;
      backoffRef.current = Math.min(backoffRef.current * 1.5, 30000);
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, delay);
    };

    ws.onerror = (err) => {
      console.error('WS Error:', err);
      ws.close();
    };
  }, [username, battleId]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connect]);

  const handleMessage = (data: any) => {
    const { type, payload } = data;
    
    if (type === 'BATTLE_ACTIVITY' && payload.battleId === battleId) {
      console.log('[ActivityFeed] Received BATTLE_ACTIVITY:', payload);
      // Create activity object from payload
      const activity = {
        username: payload.username,
        questionName: payload.questionName,
        difficulty: payload.difficulty,
        platform: payload.platform,
        points: payload.points,
        timestamp: new Date().toISOString()
      };
      setActivities(prev => [activity, ...prev].slice(0, 50));
      // Update leaderboard with points
      setLeaderboard(prev => prev.map(p => 
        p.username === payload.username 
          ? { ...p, score: (p.score || 0) + (payload.points || 0) }
          : p
      ));
    } else if (type === 'PLAYER_ELIMINATED' && payload.battleId === battleId) {
      console.log('[WebSocket] Player eliminated:', payload.username);
      setLeaderboard(prev => prev.map(p => 
        p.username === payload.username ? { ...p, isEliminated: true } : p
      ));
    } else if (type === 'BATTLE_WON' && payload.battleStats?.battleId === battleId) {
      console.log('[WebSocket] Battle won by:', payload.winner);
      setWinner(payload.winner);
    }
  };

  return { activities, leaderboard, isConnected, winner, setActivities, setLeaderboard };
}
