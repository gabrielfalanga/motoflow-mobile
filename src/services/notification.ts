import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Configurar permissões de notificação
export const setupNotifications = async (): Promise<boolean> => {
  try {
    if (!Device.isDevice) {
      console.warn("Notificações só funcionam em dispositivos físicos");
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("Permissão de notificação negada");
      return false;
    }

    // Configuração para Android
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("setor-alerts", {
        name: "Alertas de Ocupação",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF0000",
        sound: "default",
      });
    }

    return true;
  } catch (error) {
    console.error("Erro ao configurar notificações:", error);
    return false;
  }
};

// Notificação quando setor atinge >= 80% de ocupação
export const notifySetorHighOccupancy = async (
  setorNome: string,
  ocupacao: number
): Promise<void> => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⚠️ Ocupação Alta",
        body: `O setor ${setorNome} está com ${ocupacao}% de ocupação`,
        data: {
          setorNome,
          ocupacao,
          type: "setor_high_occupancy",
        },
        sound: "default",
      },
      trigger: null, // Notificação imediata
    });
    console.log(`✓ Notificação enviada: Setor ${setorNome} - ${ocupacao}%`);
  } catch (error) {
    console.error("Erro ao enviar notificação de ocupação:", error);
  }
};

// Verificar se deve notificar (>= 80% de ocupação)
export const checkAndNotifyOccupancy = async (
  setorNome: string,
  vagasOcupadas: number,
  vagasTotais: number,
  notifiedSetores: Set<string>
): Promise<boolean> => {
  if (vagasTotais === 0) return false;

  const ocupacao = Math.round((vagasOcupadas / vagasTotais) * 100);
  const setorKey = `${setorNome}-${ocupacao}`;

  // Verifica se já foi notificado nesta sessão
  if (notifiedSetores.has(setorKey)) {
    return false;
  }

  // Notifica apenas se ocupação >= 80%
  if (ocupacao >= 80) {
    await notifySetorHighOccupancy(setorNome, ocupacao);
    return true;
  }

  return false;
};

// Notificação quando setor fica lotado (100%)
export const notifySetorFull = async (setorNome: string): Promise<void> => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🚨 Setor Lotado",
        body: `O setor ${setorNome} atingiu 100% de ocupação`,
        data: {
          setorNome,
          type: "setor_full",
        },
        sound: "default",
      },
      trigger: null,
    });
    console.log(`✓ Notificação de setor lotado: ${setorNome}`);
  } catch (error) {
    console.error("Erro ao enviar notificação de setor lotado:", error);
  }
};
