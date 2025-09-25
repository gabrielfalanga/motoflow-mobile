# motoflow

**motoflow** é um aplicativo de gerenciamento inteligente de pátios para a Mottu, focado em otimizar a localização e controle de motos nos pátios operacionais distribuídos em mais de 100 filiais.

## 👨‍💻 Integrantes do Projeto

| Nome                             | RM     | GitHub                                                     |
| -------------------------------- | ------ | ---------------------------------------------------------- |
| Gabriel Martins Falanga          | 555061 | [@gabrielfalanga](https://github.com/gabrielfalanga)       |
| Arthur Chacon Garcia Spedine     | 554489 | [@arthurspedine](https://github.com/arthurspedine)         |
| Matheus Esteves Marques da Silva | 554769 | [@matheus-esteves10](https://github.com/matheus-esteves10) |

### 🚧 O Problema

A Mottu, referência no aluguel acessível de motos para trabalhadores de apps, enfrenta hoje um desafio crítico na gestão dos seus pátios operacionais, distribuídos em mais de 100 filiais com estruturas e tamanhos variados. A localização manual das motos nesses espaços gera:

- Erros frequentes e retrabalho;

- Baixa produtividade dos operadores;

- Falta de padronização nos processos;

- Ausência de visibilidade em tempo real;

- Riscos de segurança e atrasos operacionais;

- Barreiras para escalar a operação eficientemente.

## � Proposta e Funcionalidades

O motoflow é uma solução completa para gerenciamento de pátios de motos, oferecendo:

### 📊 **Dashboard Inteligente**

- Visão geral do pátio em tempo real
- Estatísticas de ocupação e distribuição de motos
- Interface otimizada para operadores

### 🛵 **Gestão de Motos**

- **Cadastro de motos**: Formulário completo com validação de dados
- **Busca inteligente**: Localização rápida por tipo, modelo ou posição
- **Rastreamento Bluetooth**: Sistema de localização em tempo real através de dispositivos BLE (Bluetooth Low Energy) instalados nas motos

### 📍 **Controle de Setores**

- Cadastro e gerenciamento de setores do pátio
- Visualização de vagas disponíveis e ocupadas
- Organização espacial otimizada

### 🔐 **Sistema de Autenticação**

- Login seguro para operadores
- Controle de acesso baseado em perfis

### 🎨 **Interface Moderna**

- Temas light e dark com preferência salva localmente
- Design responsivo e intuitivo
- Navegação simplificada com drawer navigation

### 🎯 Objetivo

Garantir eficiência, escalabilidade e precisão na operação dos pátios da Mottu, promovendo:

- Mais agilidade na entrega e devolução das motos
- Redução de erros humanos
- Operação com menos esforço manual e mais controle
- Suporte ao crescimento da Mottu com tecnologia de ponta

## 📁 Estrutura de Pastas

```
src/
├── app/               # Páginas e navegação (Expo Router)
│   ├── auth/          # Telas de autenticação
│   ├── (drawer)/      # Páginas principais com drawer navigation
│   │   ├── home/      # Dashboard e página de desenvolvedores
│   │   ├── moto/      # Cadastro e busca de motos
│   │   ├── setor/     # Detalhes de setores
│   │   └── setores/   # Listagem e cadastro de setores
│   └── _layout.tsx    # Layout principal
├── assets/            # Imagens e recursos estáticos
├── components/        # Componentes reutilizáveis
├── context/           # Contextos React (Auth, Theme)
├── helper/            # Utilitários para requisições
├── hooks/             # Custom hooks
├── interfaces/        # Definições de tipos TypeScript
└── utils/             # Funções utilitárias
```

## 🚀 Como rodar o projeto localmente

Siga os passos abaixo para rodar o projeto em sua máquina com o **Expo**:

### 📦 1. Clone o repositório

```bash
git clone https://github.com/gabrielfalanga/motoflow-mobile.git
cd motoflow-mobile
```

### 📥 2. Instale as dependências

```bash
npm install
```

### ▶️ 3. Inicie o projeto

```bash
npm start
```

Isso iniciará o Expo no **terminal interativo**, onde você verá um QR Code e poderá usar comandos como:

Você pode então escolher uma das opções:

- 📱 **Abrir no Expo Go (dispositivo físico)**:  
  Use a câmera do celular para escanear o QR Code.

- 🤖 **Abrir no emulador Android**:  
  Pressione `A` no terminal para abrir no emulador Android (caso esteja configurado).
