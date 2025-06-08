import { VercelRequest, VercelResponse } from '@vercel/node';
import { calculateDamage } from '../dist/calculator.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = calculateDamage(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}