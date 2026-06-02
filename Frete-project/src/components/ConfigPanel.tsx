import { useState } from 'react';
import type { MarketplaceConfig, CategoriaConfig } from '../hooks/useConfig';

interface Props {
  config: MarketplaceConfig[];
  onSalvar: (nova: MarketplaceConfig[]) => void;
  onResetar: () => void;
  onFechar: () => void;
}

export default function ConfigPanel({ config, onSalvar, onResetar, onFechar }: Props) {
  const [draft, setDraft] = useState<MarketplaceConfig[]>(
    () => config.map((m) => ({ ...m, categorias: m.categorias.map((c) => ({ ...c })) }))
  );
  const [novaCategoria, setNovaCategoria] = useState<Record<string, { nome: string; comissao: string }>>({});

  function atualizarMarketplace(id: string, campo: keyof MarketplaceConfig, valor: number) {
    setDraft((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [campo]: valor } : m))
    );
  }

  function adicionarCategoria(id: string) {
    const nova = novaCategoria[id];
    if (!nova?.nome.trim() || !nova?.comissao) return;
    setDraft((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, categorias: [...m.categorias, { nome: nova.nome.trim(), comissao: parseFloat(nova.comissao) }] }
          : m
      )
    );
    setNovaCategoria((prev) => ({ ...prev, [id]: { nome: '', comissao: '' } }));
  }

  function removerCategoria(marketplaceId: string, index: number) {
    setDraft((prev) =>
      prev.map((m) =>
        m.id === marketplaceId
          ? { ...m, categorias: m.categorias.filter((_, i) => i !== index) }
          : m
      )
    );
  }

  function atualizarCategoria(marketplaceId: string, index: number, campo: keyof CategoriaConfig, valor: string | number) {
    setDraft((prev) =>
      prev.map((m) =>
        m.id === marketplaceId
          ? { ...m, categorias: m.categorias.map((c, i) => i === index ? { ...c, [campo]: valor } : c) }
          : m
      )
    );
  }

  function handleSalvar() {
    onSalvar(draft);
    onFechar();
  }

  function handleResetar() {
    if (confirm('Resetar todas as configuracoes para os valores padrao?')) {
      onResetar();
      onFechar();
    }
  }

  return (
    <div className="config-overlay" onClick={(e) => e.target === e.currentTarget && onFechar()}>
      <div className="config-panel">
        <div className="config-header">
          <div className="config-header-text">
            <h2 style={{ textTransform: 'none', fontSize: 17, letterSpacing: 0, color: 'var(--navy)' }}>
              Configurar comissoes
            </h2>
            <p className="config-subtitle">Ajuste as taxas conforme sua conta em cada marketplace</p>
          </div>
          <button className="config-close" onClick={onFechar} aria-label="Fechar">✕</button>
        </div>

        <div className="config-body">
          {draft.map((m) => {
            const nova = novaCategoria[m.id] ?? { nome: '', comissao: '' };
            return (
              <div key={m.id} className="config-marketplace">
                <div className="config-marketplace-header">
                  <span className="config-marketplace-nome">{m.nome}</span>
                </div>

                <div className="config-row">
                  <div className="config-field">
                    <label>Comissao padrao (%)</label>
                    <input
                      type="number"
                      value={m.comissaoPadrao}
                      min="0"
                      max="100"
                      step="0.1"
                      onChange={(e) => atualizarMarketplace(m.id, 'comissaoPadrao', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="config-field">
                    <label>Taxa fixa por pedido (R$)</label>
                    <input
                      type="number"
                      value={m.taxaFixa}
                      min="0"
                      step="0.01"
                      onChange={(e) => atualizarMarketplace(m.id, 'taxaFixa', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                {m.categorias.length > 0 && (
                  <div className="config-categorias">
                    {m.categorias.map((cat, i) => (
                      <div key={i} className="config-categoria-row">
                        <input
                          className="config-cat-nome"
                          type="text"
                          value={cat.nome}
                          onChange={(e) => atualizarCategoria(m.id, i, 'nome', e.target.value)}
                        />
                        <input
                          className="config-cat-comissao"
                          type="number"
                          value={cat.comissao}
                          min="0"
                          max="100"
                          step="0.1"
                          onChange={(e) => atualizarCategoria(m.id, i, 'comissao', parseFloat(e.target.value) || 0)}
                        />
                        <span className="config-cat-pct">%</span>
                        <button className="config-cat-remove" onClick={() => removerCategoria(m.id, i)}>✕</button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="config-add-categoria">
                  <input
                    type="text"
                    placeholder="Nome da categoria (ex: Roupas)"
                    value={nova.nome}
                    onChange={(e) => setNovaCategoria((prev) => ({ ...prev, [m.id]: { ...nova, nome: e.target.value } }))}
                    onKeyDown={(e) => e.key === 'Enter' && adicionarCategoria(m.id)}
                  />
                  <input
                    type="number"
                    placeholder="%"
                    value={nova.comissao}
                    min="0"
                    max="100"
                    step="0.1"
                    onChange={(e) => setNovaCategoria((prev) => ({ ...prev, [m.id]: { ...nova, comissao: e.target.value } }))}
                    onKeyDown={(e) => e.key === 'Enter' && adicionarCategoria(m.id)}
                  />
                  <button className="config-add-btn" onClick={() => adicionarCategoria(m.id)}>+ Categoria</button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="config-footer">
          <button className="config-btn-reset" onClick={handleResetar}>Resetar padrao</button>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="config-btn-cancel" onClick={onFechar}>Cancelar</button>
            <button className="config-btn-save" onClick={handleSalvar}>Salvar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
