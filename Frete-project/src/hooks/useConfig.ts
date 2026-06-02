import { useState } from 'react';
import { MARKETPLACES } from '../data/marketplaces';

export interface CategoriaConfig {
  nome: string;
  comissao: number; // %
}

export interface MarketplaceConfig {
  id: string;
  nome: string;
  comissaoPadrao: number; // %
  taxaFixa: number;       // R$
  categorias: CategoriaConfig[];
}

const STORAGE_KEY = 'frete-config-marketplaces';

function defaultConfig(): MarketplaceConfig[] {
  return MARKETPLACES.map((m) => ({
    id: m.id,
    nome: m.nome,
    comissaoPadrao: +(m.comissao * 100).toFixed(2),
    taxaFixa: m.taxaFixa,
    categorias: [],
  }));
}

function loadConfig(): MarketplaceConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultConfig();
    const parsed: MarketplaceConfig[] = JSON.parse(raw);
    // garante que novos marketplaces adicionados no código apareçam mesmo com config salva
    const ids = new Set(parsed.map((m) => m.id));
    const extras = defaultConfig().filter((m) => !ids.has(m.id));
    return [...parsed, ...extras];
  } catch {
    return defaultConfig();
  }
}

export function useConfig() {
  const [config, setConfig] = useState<MarketplaceConfig[]>(loadConfig);

  function salvar(nova: MarketplaceConfig[]) {
    setConfig(nova);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nova));
  }

  function resetar() {
    const padrao = defaultConfig();
    setConfig(padrao);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(padrao));
  }

  return { config, salvar, resetar };
}
