import express from 'express';
import ledgerRouter from './routes/ledger.js';
import servicesRouter from './routes/services.js';
import accountsRouter from './routes/accounts.js';

const router = express.Router();

router.use('/ledger', ledgerRouter);
router.use('/services', servicesRouter);
router.use('/accounts', accountsRouter);

export default router;
