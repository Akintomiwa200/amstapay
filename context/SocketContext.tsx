import React, { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';
import { API } from '@/lib/constants';
import { storage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, connected: false });

export function SocketProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let socket: Socket | null = null;

    const connect = async () => {
      const token = await storage.get<string>(STORAGE_KEYS.TOKEN);
      if (!token) return;

      socket = io(API.BASE_URL, {
        path: '/socket.io',
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
      });

      socket.on('connect', () => setConnected(true));
      socket.on('disconnect', () => setConnected(false));
      socket.on('connect_error', () => setConnected(false));

      socket.on('account:deleted', () => {
        socket?.disconnect();
      });

      socketRef.current = socket;
    };

    connect();

    return () => {
      socket?.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
