export interface Marketplace {
  id: string;
  nome: string;
  comissao: number;       // % sobre o preço de venda
  taxaFixa: number;       // R$ por pedido
  nota: string;
}

export interface RegimeTributario {
  id: string;
  nome: string;
  aliquota: number;       // % sobre o faturamento
  nota: string;
}

export const MARKETPLACES: Marketplace[] = [
  {
    id: 'shopee',
    nome: 'Shopee',
    comissao: 0.14,
    taxaFixa: 0,
    nota: 'Comissão base ~14% (varia por categoria)',
  },
  {
    id: 'ml_gratis',
    nome: 'Mercado Livre Grátis',
    comissao: 0.17,
    taxaFixa: 6,
    nota: '+R$6 por pedido acima de R$79',
  },
  {
    id: 'ml_classico',
    nome: 'Mercado Livre Clássico',
    comissao: 0.12,
    taxaFixa: 6,
    nota: '+R$6 por pedido',
  },
  {
    id: 'ml_premium',
    nome: 'Mercado Livre Premium',
    comissao: 0.17,
    taxaFixa: 6,
    nota: 'Frete grátis incluso, +R$6 por pedido',
  },
  {
    id: 'tiktok',
    nome: 'TikTok Shop',
    comissao: 0.08,
    taxaFixa: 0,
    nota: 'Comissão ~8% (pode variar por campanha)',
  },
  {
    id: 'amazon',
    nome: 'Amazon',
    comissao: 0.12,
    taxaFixa: 0,
    nota: 'Comissão ~12% (varia muito por categoria)',
  },
  {
    id: 'magalu',
    nome: 'Magalu',
    comissao: 0.13,
    taxaFixa: 0,
    nota: 'Comissão ~13% média',
  },
  {
    id: 'americanas',
    nome: 'Americanas',
    comissao: 0.14,
    taxaFixa: 0,
    nota: 'Comissão ~14% média',
  },
];

export const REGIMES_TRIBUTARIOS: RegimeTributario[] = [
  {
    id: 'mei',
    nome: 'MEI',
    aliquota: 0,
    nota: 'Imposto fixo mensal (~R$71/mês). Coloque 0% ou calcule separado.',
  },
  {
    id: 'simples_1',
    nome: 'Simples Nacional — Faixa 1 (até R$180k/ano)',
    aliquota: 0.04,
    nota: '4% sobre o faturamento bruto',
  },
  {
    id: 'simples_2',
    nome: 'Simples Nacional — Faixa 2 (até R$360k/ano)',
    aliquota: 0.073,
    nota: '7,3% sobre o faturamento bruto',
  },
  {
    id: 'simples_3',
    nome: 'Simples Nacional — Faixa 3 (até R$720k/ano)',
    aliquota: 0.095,
    nota: '9,5% sobre o faturamento bruto',
  },
  {
    id: 'lucro_presumido',
    nome: 'Lucro Presumido',
    aliquota: 0.0911,
    nota: 'PIS + COFINS + IR + CSLL estimado (~9,11%)',
  },
  {
    id: 'custom',
    nome: 'Personalizado',
    aliquota: 0,
    nota: 'Digite sua alíquota manualmente',
  },
];
