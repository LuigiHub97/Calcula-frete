import { Router, Request, Response } from 'express';
import { calcularFrete, FreteInput } from '../services/melhorEnvio';

const router = Router();

router.post('/calcular', async (req: Request, res: Response) => {
  const { cepOrigem, cepDestino, peso, altura, largura, comprimento, valor } = req.body as FreteInput;

  if (!cepOrigem || !cepDestino || !peso || !altura || !largura || !comprimento || !valor) {
    res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
    return;
  }

  try {
    const resultado = await calcularFrete({ cepOrigem, cepDestino, peso, altura, largura, comprimento, valor });
    res.json(resultado);
  } catch (error: any) {
    console.error(error?.response?.data || error.message);
    res.status(500).json({ erro: 'Erro ao consultar o Melhor Envio.' });
  }
});

export default router;
