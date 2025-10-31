import { setupNotifications } from "@/services/notification";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface NotificationContextType {
  isEnabled: boolean;
  isReady: boolean;
  notifiedSetores: Set<string>;
  addNotifiedSetor: (setor: string) => void;
  clearNotifiedSetores: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [notifiedSetores, setNotifiedSetores] = useState<Set<string>>(new Set());

  useEffect(() => {
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    try {
      const enabled = await setupNotifications();
      setIsEnabled(enabled);
      console.log("Notificações inicializadas:", enabled ? "✓" : "✗");
    } catch (error) {
      console.error("Erro ao inicializar notificações:", error);
      setIsEnabled(false);
    } finally {
      setIsReady(true);
    }
  };

  const addNotifiedSetor = (setor: string) => {
    setNotifiedSetores((prev) => new Set(prev).add(setor));
  };

  const clearNotifiedSetores = () => {
    setNotifiedSetores(new Set());
  };

  return (
    <NotificationContext.Provider
      value={{
        isEnabled,
        isReady,
        notifiedSetores,
        addNotifiedSetor,
        clearNotifiedSetores,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
