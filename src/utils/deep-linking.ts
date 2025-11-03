import { Alert, Linking } from "react-native";

interface MotoData {
  placa: string;
  codRastreador?: string | null;
  tipoMoto: string;
  ano: number;
  statusMoto: string;
  setor?: string | null;
}

/**
 * Abre o aplicativo Kotlin de rastreamento enviando os dados da moto via deep link
 * @param motoData - Dados da moto a serem enviados
 * @param errorMessage - Mensagem de erro customizada (opcional)
 */
export async function abrirAppRastreamento(
  motoData: MotoData,
  errorMessage?: string
): Promise<void> {
  // Construir URL com os dados da moto como parâmetros
  const params = new URLSearchParams({
    placa: motoData.placa,
    codRastreador: motoData.codRastreador || "",
    tipoMoto: motoData.tipoMoto,
    ano: motoData.ano.toString(),
    statusMoto: motoData.statusMoto,
    setor: motoData.setor || "",
  });

  // URL customizada que o app Kotlin vai "ouvir"
  const url = `appkotlinmotoflow://abrir?${params.toString()}`;

  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        "App não encontrado",
        errorMessage || "O aplicativo de rastreamento não está instalado neste dispositivo."
      );
    }
  } catch (error) {
    console.error("Erro ao abrir app de rastreamento:", error);
    Alert.alert("Erro", "Não foi possível abrir o aplicativo de rastreamento.");
  }
}
