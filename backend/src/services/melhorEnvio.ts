import axios from 'axios';

const API_URL = 'https://melhorenvio.com.br/api/v2/me/shipment/calculate';

export interface FreteInput {
  cepOrigem: string;
  cepDestino: string;
  peso: number;       // kg
  altura: number;     // cm
  largura: number;    // cm
  comprimento: number; // cm
  valor: number;      // valor declarado do produto em R$
}

export interface FreteResultado {
  id: number;
  nome: string;
  prazo: number;
  preco: string;
  logoUrl?: string;
  erro?: string;
}

export async function calcularFrete(input: FreteInput): Promise<FreteResultado[]> {
  const token = process.env.MELHOR_ENVIO_TOKEN;

  const response = await axios.post(
    API_URL,
    {
      from: { postal_code: input.cepOrigem },
      to: { postal_code: input.cepDestino },
      package: {
        height: input.altura,
        width: input.largura,
        length: input.comprimento,
        weight: input.peso,
      },
      options: {
        insurance_value: input.valor,
        receipt: false,
        own_hand: false,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'FreteApp/1.0 (luigiscaglione12@hotmail.com)',
      },
    }
  );

  return response.data.map((servico: any) => ({
    id: servico.id,
    nome: servico.name,
    prazo: servico.delivery_time,
    preco: servico.price,
    logoUrl: servico.company?.picture,
    erro: servico.error,
  }));
}
