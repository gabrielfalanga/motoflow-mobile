import { Text, View, Button, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
//Novo sistema de camera no Expo SDK 51+
import { CameraView, useCameraPermissions } from 'expo-camera';



export default function UseCamera() {
  //Estado de permissao da camera
  const [permissaoCam, requestPermissaoCam] = useCameraPermissions()

  //Referência da câmera (acesso direto ao componente)
  const cameraRef = useRef<any>(null)

  //Estado da foto capturada
  const [foto, setFoto] = useState<any>(null)

  //Estado para alternar as cameras (frontal e traseira)
  const[isFrontCamera,setIsFrontCamera]=useState(false)

  //Estado para gerenciar o flash do dispositivo
  const[flashLigado,setFlashLigado]=useState(false)

  //Função para tirar foto
  const tirarFoto = async () => {
    if (cameraRef.current) {
      const dadoFoto = await cameraRef.current.takePictureAsync()//captura a imagem
      setFoto(dadoFoto)
    }
  }

  //Alternar o valor do estado (true/false)
  const alternarCamera = () =>{
    setIsFrontCamera(!isFrontCamera)
  }

  //Alternar o flash
  const alternarFlash = () =>{
    setFlashLigado(!flashLigado)
  }

  //Enquanto a permissão não estiver carregada
  if (!permissaoCam) return <View />

  //Se a permissão da câmera foi negada
  if (!permissaoCam?.granted) {
    return (
      <View>
        <Text>Permissão da câmera não foi concedida</Text>
        <Button title="Permitir" onPress={requestPermissaoCam} />
      </View>
    )
  }

  return (
    <View className="flex-1">
      {!foto ? (
        <View className="flex-1">
          <CameraView
            ref={cameraRef}
            style={{ flex: 1 }}
            facing={isFrontCamera?'front':'back'}
            flash={flashLigado?'on':'off'}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', margin: 16 }}>
            <TouchableOpacity onPress={tirarFoto} style={{ padding: 12, backgroundColor: '#eee', borderRadius: 8 }}>
              <Text>Tirar Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={alternarCamera} style={{ padding: 12, backgroundColor: '#eee', borderRadius: 8 }}>
              <Text>Alterar câmera</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={alternarFlash} style={{ padding: 12, backgroundColor: '#eee', borderRadius: 8 }}>
              <Text>{flashLigado ? 'Desligar Flash' : 'Ligar Flash'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View className="flex-1">
          <Image
            source={{uri:foto.uri}}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', margin: 16 }}>
            <TouchableOpacity onPress={()=>setFoto(null)} style={{ padding: 12, backgroundColor: '#eee', borderRadius: 8 }}>
              <Text>Tirar outra foto</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>setFoto(null)} style={{ padding: 12, backgroundColor: '#eee', borderRadius: 8 }}>
              <Text>Enviar foto</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
