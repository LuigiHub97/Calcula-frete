# Calculadora de Frete

Ferramenta pessoal para gestão de custos de e-commerce. Calcula fretes em tempo real via API do Melhor Envio e simula a margem líquida por marketplace, incluindo comissões e impostos.

---

## Funcionalidades

- **Cálculo de frete** — busca opções de entrega (Correios, Jadlog, Loggi, Azul Cargo, etc.) pelo CEP de origem e destino via API do Melhor Envio
- **Seleção de frete** — clique em uma opção e o valor entra automaticamente no cálculo de custos
- **Calculadora de margem** — simula o lucro líquido considerando:
  - Comissão do marketplace (Shopee, Mercado Livre, TikTok Shop, Amazon, Magalu, Americanas)
  - Categoria do produto com taxa customizável
  - Regime tributário (MEI, Simples Nacional, Lucro Presumido)
  - Taxa fixa por pedido
  - Custo do frete
- **Configuração de taxas** — painel lateral para editar as comissões e adicionar categorias por marketplace, com persistência via `localStorage`

---

## Stack

| Camada   | Tecnologia                        |
|----------|-----------------------------------|
| Frontend | React 19 + TypeScript + Vite      |
| Backend  | Node.js + Express + TypeScript    |
| API      | Melhor Envio (produção)           |
| Estilo   | CSS puro (sem framework)          |
| Deploy   | — (local por enquanto)            |

---

## Estrutura

```
Calcula-frete/
├── Frete-project/          # Frontend React
│   └── src/
│       ├── components/
│       │   ├── CostCalculator.tsx
│       │   └── ConfigPanel.tsx
│       ├── data/
│       │   └── marketplaces.ts   # taxas e regimes tributários
│       ├── hooks/
│       │   └── useConfig.ts      # leitura/escrita no localStorage
│       ├── App.tsx
│       └── App.css
└── backend/                # Backend Express
    └── src/
        ├── routes/
        │   └── frete.ts          # POST /api/frete/calcular
        └── services/
            └── melhorEnvio.ts    # integração com a API
```

---

## Como rodar

### Pré-requisitos

- Node.js 18+
- Conta no [Melhor Envio](https://melhorenvio.com.br) com token de acesso gerado

### 1. Backend

```bash
cd backend
npm install
```

Crie o arquivo `.env`:

```env
MELHOR_ENVIO_TOKEN=seu_token_aqui
PORT=3001
```

```bash
npm run dev
```

O backend sobe em `http://localhost:3001`.

### 2. Frontend

```bash
cd Frete-project
npm install
npm run dev
```

O frontend sobe em `http://localhost:5173`.

---

## Configurando as taxas

Clique em **Configurar taxas** no canto superior direito para:

- Editar a comissão padrão de cada marketplace
- Adicionar categorias com taxas específicas (ex: Roupas → 18%)
- Ajustar taxa fixa por pedido

As configurações ficam salvas no navegador (`localStorage`).

---

## Roadmap

- [ ] Integração com a API pública do Mercado Livre (categorias + comissões reais por categoria)
- [ ] Deploy (Railway / Vercel)
- [ ] Histórico de simulações
