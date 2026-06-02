import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import freteRouter from './routes/frete';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/frete', freteRouter);

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
