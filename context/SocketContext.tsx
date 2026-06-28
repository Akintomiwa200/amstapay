import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
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
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let activeSocket: Socket | null = null;

    const connect = async () => {
      const token = await storage.get<string>(STORAGE_KEYS.TOKEN);
      if (!token) {
        setSocket(null);
        setConnected(false);
        return;
      }

      activeSocket = io(API.BASE_URL, {
        path: '/socket.io',
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
      });

      activeSocket.on('connect', () => setConnected(true));
      activeSocket.on('disconnect', () => setConnected(false));
      activeSocket.on('connect_error', () => setConnected(false));
      activeSocket.on('account:deleted', () => {
        activeSocket?.disconnect();
      });

      setSocket(activeSocket);
    };

    connect();

    return () => {
      activeSocket?.disconnect();
      setSocket(null);
      setConnected(false);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
