import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import { validVins } from './validVins';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/verify', (req: Request, res: Response): Promise<void> => {
  const { vin, make, model, year } = req.query;

  if (!vin || !make || !model || !year) {
    res.status(400).json({ error: 'Missing required parameters' });
    return Promise.resolve();
  }

  const isValidVin = validVins.includes(vin as string);
  const randomFactor = Math.random();

  let isVerified;
  if (isValidVin) {
    isVerified = randomFactor > 0.1;
  } else {
    isVerified = randomFactor > 0.9;
  }

  return new Promise<void>((resolve) => {
    setTimeout(() => {
      res.json({
        vin,
        make,
        model,
        year,
        isVerified,
        message: isVerified ? 'Car details verified successfully' : 'Car verification failed'
      });
      resolve();
    }, 1000 + Math.random() * 2000);
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Car verification API listening at http://localhost:${port}`);
});