# ConstruApp 🏗️

Aplicativo mobile para criação e gerenciamento de orçamentos de obras e reformas, desenvolvido com React Native + Expo.

## Sobre o projeto

O ConstruApp foi criado para profissionais da construção civil que precisam gerar orçamentos de forma rápida e organizada diretamente pelo celular. Com ele é possível cadastrar clientes, adicionar itens por categoria (material, mão de obra ou serviço), acompanhar o status de cada orçamento e visualizar um dashboard financeiro.

## Funcionalidades

- Autenticação com login e cadastro de usuário
- Criação, edição e exclusão de orçamentos
- Adição de itens com categorias: Material, Mão de Obra e Serviço
- Cálculo automático com suporte a desconto e taxa extra
- Status por orçamento: Em Análise, Enviado, Aprovado ou Recusado
- Dashboard com receita total, taxa de aprovação e ticket médio
- Busca e filtragem de orçamentos
- Sincronização com backend via push/pull
- Banco de dados local com SQLite (offline-first)

## Tecnologias

- React Native + Expo
- TypeScript
- expo-sqlite (banco local)      
- React Navigation
- Axios
- expo-secure-store
- Lucide React Native

## Como rodar
```bash
npm install
npx expo start
```![WhatsApp Image 2026-03-05 at 00 41 12](https://github.com/user-attachments/assets/aa089300-a30d-45a9-85a5-60adb71f84ce)


Configure as variáveis de ambiente no arquivo `.env`:
```env
EXPO_PUBLIC_API_URL=https://sua-api.com
EXPO_PUBLIC_API_KEY=sua-chave
```

## Estrutura
```
src/
├── modules/
│   ├── auth/        # Login, registro e contexto de autenticação
│   ├── budgets/     # Orçamentos, formulários e dashboard
│   ├── items/       # Itens dos orçamentos
│   └── sync/        # Sincronização com backend
├── database/        # SQLite e migrations
├── navigation/      # Rotas da aplicação
└── services/        # Configuração do Axios
```

## Screenshots

<img src="https://github.com/user-attachments/assets/5f3f140a-a3c3-44d8-b4dc-1841d3d3ca23" width="300">
<img src="https://github.com/user-attachments/assets/1f0d556f-056f-44e7-8a6c-9dc9560d3fce" width="300">
<img src="https://github.com/user-attachments/assets/dd7bc432-67b6-4ff8-b045-136492003b0f" width="300">

<img src="https://github.com" width="300">

