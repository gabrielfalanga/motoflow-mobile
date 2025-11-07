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

- **Cadastro de motos**: Formulário completo com validação de dados e captura de fotos
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
- Suporte a múltiplos idiomas (Português e Espanhol)
- Notificações em tempo real

### 🎯 Objetivo

Garantir eficiência, escalabilidade e precisão na operação dos pátios da Mottu, promovendo:

- Mais agilidade na entrega e devolução das motos
- Redução de erros humanos
- Operação com menos esforço manual e mais controle
- Suporte ao crescimento da Mottu com tecnologia de ponta

## 📁 Estrutura de Pastas

```
src/
├── app/                    # Páginas e navegação (Expo Router)
│   ├── _layout.tsx         # Layout principal da aplicação
│   ├── index.tsx           # Página inicial/redirecionamento
│   ├── auth/               # Telas de autenticação
│   │   ├── _layout.tsx     # Layout das páginas de autenticação
│   │   └── login.tsx       # Tela de login
│   └── (drawer)/           # Páginas principais com drawer navigation
│       ├── _layout.tsx     # Layout do drawer
│       ├── account.tsx     # Página de conta do usuário
│       ├── logout.tsx      # Página de logout
│       ├── patio.tsx       # Visão geral do pátio
│       ├── home/           # Dashboard e informações
│       │   ├── _layout.tsx # Layout das páginas home
│       │   ├── index.tsx   # Dashboard principal
│       │   ├── devs.tsx    # Página de desenvolvedores
│       │   └── sobre.tsx   # Página sobre o app
│       ├── moto/           # Gestão de motos
│       │   ├── _layout.tsx # Layout das páginas de moto
│       │   ├── cadastro-moto.tsx  # Cadastro de motos
│       │   └── busca-moto.tsx     # Busca de motos
│       ├── setor/          # Detalhes de setores
│       │   └── [setor].tsx # Página dinâmica de setor individual
│       └── setores/        # Gestão de setores
│           ├── _layout.tsx # Layout das páginas de setores
│           ├── index.tsx   # Listagem de setores
│           └── cadastro-setor.tsx # Cadastro de setores
├── assets/                 # Imagens e recursos estáticos
├── components/             # Componentes reutilizáveis
│   ├── Header.tsx          # Cabeçalho da aplicação
│   ├── language-toggle.tsx # Toggle de idioma (pt/es)
│   ├── moto-details-modal.tsx    # Modal de detalhes da moto
│   ├── notification-card.tsx     # Card de notificação
│   ├── patio-details-card.tsx    # Card de detalhes do pátio
│   ├── patio-header.tsx          # Cabeçalho do pátio
│   ├── patio-setores-grid.tsx    # Grade de setores do pátio
│   ├── patio-stats-cards.tsx     # Cards de estatísticas do pátio
│   ├── patio-summary.tsx         # Resumo do pátio
│   ├── quick-action-card.tsx     # Card de ação rápida
│   ├── submit-button.tsx         # Botão de submit customizado
│   ├── theme-toggle.tsx          # Toggle de tema (light/dark)
│   └── vaga-posicao.tsx          # Componente de vaga/posição
├── context/                # Contextos React
│   ├── auth-context.tsx    # Contexto de autenticação
│   ├── notification-context.tsx # Contexto de notificações
│   └── theme-context.tsx   # Contexto de tema
├── helper/                 # Helpers e utilitários
│   └── request.ts          # Helper para requisições HTTP
├── hooks/                  # Custom hooks
│   ├── use-patio-data.ts   # Hook para dados do pátio
│   └── use-setor-data.ts   # Hook para dados de setores
├── interfaces/             # Definições de tipos TypeScript
│   └── interfaces.ts       # Interfaces do projeto
├── locales/                # Arquivos de internacionalização
│   ├── pt.json             # Traduções em português
│   └── es.json             # Traduções em espanhol
├── services/               # Serviços da aplicação
│   ├── i18n.ts             # Configuração de internacionalização
│   └── notification.ts     # Serviço de notificações
├── utils/                  # Funções utilitárias
│   ├── color-theme.ts      # Utilitários de tema/cores
│   └── deep-linking.ts     # Configuração de deep linking
└── global.css              # Estilos globais (Tailwind CSS)
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
