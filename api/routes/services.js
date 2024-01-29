import express from 'express';
import services from '../../services/index.js';

const router = express.Router();

router.get('/available', async (req, res) => {
  const {services: all_services} = services;
  res.status(200).json({ data: Object.keys(all_services) });
})

router.get('/sync', async (req, res) => {
  await services.sync.transactions();
  res.status(200).json({ data: true });
});

router.post('/enrollment', async (req, res) => {
  const { enrollment, service, environment } = req.body;
  console.log('enrollment', enrollment, service, environment);

  const connection = await services.connect(enrollment, service, environment);

  res.status(200).json({ data: connection });
});

router.get('/balance', async (req, res) => {
  const account_balances = await services.get.balance();
  res.status(200).json({ data: account_balances });
});

export default router;
