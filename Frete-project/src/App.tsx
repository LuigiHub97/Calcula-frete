import { useState } from 'react';
import './App.css';
import CostCalculator from './components/CostCalculator';
import ConfigPanel from './components/ConfigPanel';
import { useConfig } from './hooks/useConfig';

interface FreteResultado {
  id: number;
  nome: string;
  prazo: number;
  preco: string;
  logoUrl?: string;
  erro?: string;
}

export interface FreteEscolhido {
  id: number;
  nome: string;
  prazo: number;
  preco: number;
  logoUrl?: string;
}

const camposIniciais = {
  cepOrigem: '',
  cepDestino: '',
  peso: '',
  altura: '',
  largura: '',
  comprimento: '',
  valor: '',
};

export default function App() {
  const { config, salvar, resetar } = useConfig();
  const [configAberto, setConfigAberto] = useState(false);

  const [form, setForm] = useState(camposIniciais);
  const [resultados, setResultados] = useState<FreteResultado[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [freteEscolhido, setFreteEscolhido] = useState<FreteEscolhido | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: { currentTarget: HTMLFormElement; preventDefault(): void }) {
    e.preventDefault();
    setCarregando(true);
    setErro('');
    setResultados([]);
    setFreteEscolhido(null);

    try {
      const res = await fetch('https://calcula-frete.onrender.com/api/frete/calcular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cepOrigem: form.cepOrigem,
          cepDestino: form.cepDestino,
          peso: Number(form.peso),
          altura: Number(form.altura),
          largura: Number(form.largura),
          comprimento: Number(form.comprimento),
          valor: Number(form.valor),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErro(data.erro || 'Erro desconhecido.');
        return;
      }

      const data: FreteResultado[] = await res.json();
      setResultados(data.filter((s) => !s.erro));
    } catch {
      setErro('Nao foi possivel conectar ao servidor. Verifique se o backend esta rodando.');
    } finally {
      setCarregando(false);
    }
  }

  function selecionarFrete(r: FreteResultado) {
    setFreteEscolhido({
      id: r.id,
      nome: r.nome,
      prazo: r.prazo,
      preco: parseFloat(r.preco),
      logoUrl: r.logoUrl,
    });
  }

  return (
    <>
      <header className="top-bar">
        <span className="top-bar-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="7" width="14" height="10" rx="1" />
            <path d="M15 9h4l3 3v5h-7V9z" />
            <circle cx="5.5" cy="18.5" r="1.5" />
            <circle cx="18.5" cy="18.5" r="1.5" />
          </svg>
        </span>
        <div className="top-bar-text">
          <h1>Calculadora de Frete</h1>
          <p>Gestao de custos para e-commerce</p>
        </div>
        <button className="config-trigger" onClick={() => setConfigAberto(true)} aria-label="Configuracoes">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          Configurar taxas
        </button>
      </header>

      <div className="app">
        <div className="card">
          <h2 className="card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10H3M16 2l5 8-5 8M8 2L3 10l5 8" />
            </svg>
            Dados do envio
          </h2>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <Field label="CEP Origem" name="cepOrigem" value={form.cepOrigem} onChange={handleChange} placeholder="00000-000" />
              <Field label="CEP Destino" name="cepDestino" value={form.cepDestino} onChange={handleChange} placeholder="00000-000" />
            </div>

            <div className="divider" />

            <div className="form-group">
              <Field label="Peso (kg)" name="peso" value={form.peso} onChange={handleChange} type="number" placeholder="0.5" />
              <Field label="Valor declarado (R$)" name="valor" value={form.valor} onChange={handleChange} type="number" placeholder="100" />
            </div>

            <div className="form-group">
              <Field label="Altura (cm)" name="altura" value={form.altura} onChange={handleChange} type="number" placeholder="10" />
              <Field label="Largura (cm)" name="largura" value={form.largura} onChange={handleChange} type="number" placeholder="15" />
              <Field label="Comprimento (cm)" name="comprimento" value={form.comprimento} onChange={handleChange} type="number" placeholder="20" />
            </div>

            <button type="submit" className="btn-submit" disabled={carregando}>
              {carregando ? 'Calculando...' : 'Calcular Frete'}
            </button>
          </form>
        </div>

        {erro && <div className="error-msg">{erro}</div>}

        {resultados.length > 0 && (
          <div className="card">
            <h2 className="card-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="7" width="14" height="10" rx="1" />
                <path d="M15 9h4l3 3v5h-7V9z" />
                <circle cx="5.5" cy="18.5" r="1.5" />
                <circle cx="18.5" cy="18.5" r="1.5" />
              </svg>
              Opcoes de entrega — clique para usar no calculo
            </h2>
            <table className="results-table">
              <thead>
                <tr>
                  <th>Transportadora</th>
                  <th>Prazo</th>
                  <th>Preco</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((r) => {
                  const selecionado = freteEscolhido?.id === r.id;
                  return (
                    <tr
                      key={r.id}
                      className={`result-row ${selecionado ? 'result-row--selected' : ''}`}
                      onClick={() => selecionarFrete(r)}
                    >
                      <td>
                        <span className="carrier-name">
                          {r.logoUrl && <img src={r.logoUrl} className="company-logo" alt="" />}
                          {r.nome}
                        </span>
                      </td>
                      <td>
                        <span className="badge-days">{r.prazo} dias</span>
                      </td>
                      <td className="price">
                        {selecionado && <span className="check-icon">✓ </span>}
                        R$ {r.preco}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <CostCalculator freteEscolhido={freteEscolhido} marketplacesConfig={config} />
      </div>

      {configAberto && (
        <ConfigPanel
          config={config}
          onSalvar={salvar}
          onResetar={resetar}
          onFechar={() => setConfigAberto(false)}
        />
      )}
    </>
  );
}

function Field({
  label, name, value, onChange, type = 'text', placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        required
        min={type === 'number' ? '0' : undefined}
        step={type === 'number' ? 'any' : undefined}
      />
    </div>
  );
}
