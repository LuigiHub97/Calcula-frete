import { useState, useMemo } from 'react';
import { REGIMES_TRIBUTARIOS } from '../data/marketplaces';
import type { MarketplaceConfig } from '../hooks/useConfig';
import type { FreteEscolhido } from '../App';

interface Props {
  freteEscolhido: FreteEscolhido | null;
  marketplacesConfig: MarketplaceConfig[];
}

interface Resultado {
  precoVenda: number;
  custoProduto: number;
  comissaoValor: number;
  taxaFixa: number;
  impostoValor: number;
  freteValor: number;
  lucroLiquido: number;
  margemLiquida: number;
}

export default function CostCalculator({ freteEscolhido, marketplacesConfig }: Props) {
  const [precoVenda, setPrecoVenda] = useState('');
  const [custoProduto, setCustoProduto] = useState('');
  const [marketplaceId, setMarketplaceId] = useState(marketplacesConfig[0]?.id ?? '');
  const [categoriaIndex, setCategoriaIndex] = useState<number>(-1); // -1 = padrão
  const [regimeId, setRegimeId] = useState('simples_1');
  const [aliquotaCustom, setAliquotaCustom] = useState('');

  const marketplace = marketplacesConfig.find((m) => m.id === marketplaceId) ?? marketplacesConfig[0];
  const regime = REGIMES_TRIBUTARIOS.find((r) => r.id === regimeId)!;

  const comissaoAtiva =
    categoriaIndex >= 0 && marketplace?.categorias[categoriaIndex]
      ? marketplace.categorias[categoriaIndex].comissao / 100
      : (marketplace?.comissaoPadrao ?? 0) / 100;

  const nomeComissao =
    categoriaIndex >= 0 && marketplace?.categorias[categoriaIndex]
      ? marketplace.categorias[categoriaIndex].nome
      : 'Padrao';

  function handleMarketplaceChange(id: string) {
    setMarketplaceId(id);
    setCategoriaIndex(-1);
  }

  const resultado = useMemo<Resultado | null>(() => {
    const venda = parseFloat(precoVenda);
    const custo = parseFloat(custoProduto);
    if (!venda || !custo || venda <= 0 || custo <= 0) return null;

    const aliquota = regimeId === 'custom'
      ? (parseFloat(aliquotaCustom) || 0) / 100
      : regime.aliquota;

    const comissaoValor = venda * comissaoAtiva;
    const taxaFixa = marketplace?.taxaFixa ?? 0;
    const impostoValor = venda * aliquota;
    const freteValor = freteEscolhido?.preco ?? 0;

    const lucroLiquido = venda - custo - comissaoValor - taxaFixa - impostoValor - freteValor;
    const margemLiquida = (lucroLiquido / venda) * 100;

    return { precoVenda: venda, custoProduto: custo, comissaoValor, taxaFixa, impostoValor, freteValor, lucroLiquido, margemLiquida };
  }, [precoVenda, custoProduto, marketplaceId, categoriaIndex, regimeId, aliquotaCustom, freteEscolhido, marketplace, regime, comissaoAtiva]);

  const fmt = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="card">
      <h2 className="card-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
        Custos e margem
      </h2>

      <div className="cost-form">
        <div className="form-group">
          <div className="field">
            <label htmlFor="precoVenda">Preco de venda (R$)</label>
            <input
              id="precoVenda"
              type="number"
              placeholder="150,00"
              value={precoVenda}
              onChange={(e) => setPrecoVenda(e.target.value)}
              min="0"
              step="any"
            />
          </div>
          <div className="field">
            <label htmlFor="custoProduto">Custo do produto (R$)</label>
            <input
              id="custoProduto"
              type="number"
              placeholder="60,00"
              value={custoProduto}
              onChange={(e) => setCustoProduto(e.target.value)}
              min="0"
              step="any"
            />
          </div>
        </div>

        <div className="form-group">
          <div className="field">
            <label htmlFor="marketplace">Marketplace</label>
            <div className="select-wrap">
              <select
                id="marketplace"
                value={marketplaceId}
                onChange={(e) => handleMarketplaceChange(e.target.value)}
              >
                {marketplacesConfig.map((m) => (
                  <option key={m.id} value={m.id}>{m.nome}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="categoria">Categoria</label>
            <div className="select-wrap">
              <select
                id="categoria"
                value={categoriaIndex}
                onChange={(e) => setCategoriaIndex(Number(e.target.value))}
              >
                <option value={-1}>Padrao ({marketplace?.comissaoPadrao ?? 0}%)</option>
                {marketplace?.categorias.map((cat, i) => (
                  <option key={i} value={i}>{cat.nome} ({cat.comissao}%)</option>
                ))}
              </select>
            </div>
            {(marketplace?.categorias.length ?? 0) === 0 && (
              <span className="field-hint">Configure categorias no painel de config</span>
            )}
          </div>
        </div>

        <div className="field">
          <label htmlFor="regime">Regime tributario</label>
          <div className="select-wrap">
            <select
              id="regime"
              value={regimeId}
              onChange={(e) => setRegimeId(e.target.value)}
            >
              {REGIMES_TRIBUTARIOS.map((r) => (
                <option key={r.id} value={r.id}>{r.nome}</option>
              ))}
            </select>
          </div>
          <span className="field-hint">{regime.nota}</span>
        </div>

        {regimeId === 'custom' && (
          <div className="field">
            <label htmlFor="aliquotaCustom">Aliquota (%)</label>
            <input
              id="aliquotaCustom"
              type="number"
              placeholder="10"
              value={aliquotaCustom}
              onChange={(e) => setAliquotaCustom(e.target.value)}
              min="0"
              max="100"
              step="any"
            />
          </div>
        )}

        {freteEscolhido ? (
          <div className="frete-selecionado">
            {freteEscolhido.logoUrl && (
              <img src={freteEscolhido.logoUrl} alt="" className="company-logo" />
            )}
            <span>
              <strong>{freteEscolhido.nome}</strong> — {freteEscolhido.prazo} dias —{' '}
              {fmt(freteEscolhido.preco)}
            </span>
          </div>
        ) : (
          <p className="cost-placeholder" style={{ marginBottom: 0 }}>
            Calcule o frete acima e clique em uma opcao para incluir no custo.
          </p>
        )}
      </div>

      {resultado ? (
        <div className="breakdown">
          <div className="breakdown-row breakdown-row--income">
            <span>Preco de venda</span>
            <span>{fmt(resultado.precoVenda)}</span>
          </div>

          <div className="breakdown-divider" />

          <div className="breakdown-row breakdown-row--cost">
            <span>Custo do produto</span>
            <span>- {fmt(resultado.custoProduto)}</span>
          </div>
          <div className="breakdown-row breakdown-row--cost">
            <span>
              Comissao {marketplace?.nome}
              <em> {nomeComissao} ({(comissaoAtiva * 100).toFixed(1)}%)</em>
            </span>
            <span>- {fmt(resultado.comissaoValor)}</span>
          </div>
          {resultado.taxaFixa > 0 && (
            <div className="breakdown-row breakdown-row--cost">
              <span>Taxa fixa por pedido</span>
              <span>- {fmt(resultado.taxaFixa)}</span>
            </div>
          )}
          <div className="breakdown-row breakdown-row--cost">
            <span>
              Imposto
              {regimeId !== 'custom' && regimeId !== 'mei' && (
                <em> ({(regime.aliquota * 100).toFixed(1)}%)</em>
              )}
              {regimeId === 'custom' && aliquotaCustom && (
                <em> ({aliquotaCustom}%)</em>
              )}
            </span>
            <span>- {fmt(resultado.impostoValor)}</span>
          </div>
          {resultado.freteValor > 0 && (
            <div className="breakdown-row breakdown-row--cost">
              <span>Frete — {freteEscolhido?.nome}</span>
              <span>- {fmt(resultado.freteValor)}</span>
            </div>
          )}

          <div className="breakdown-divider" />

          <div className={`breakdown-row breakdown-row--total ${resultado.lucroLiquido < 0 ? 'breakdown-row--loss' : 'breakdown-row--profit'}`}>
            <span>Lucro liquido</span>
            <span>{fmt(resultado.lucroLiquido)}</span>
          </div>
          <div className={`breakdown-row breakdown-row--margin ${resultado.margemLiquida < 0 ? 'breakdown-row--loss' : ''}`}>
            <span>Margem liquida</span>
            <span>{resultado.margemLiquida.toFixed(1)}%</span>
          </div>
        </div>
      ) : (
        <p className="cost-placeholder">Preencha o preco de venda e o custo para ver o resultado.</p>
      )}
    </div>
  );
}
