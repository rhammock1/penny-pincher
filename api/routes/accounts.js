import express from 'express';
import {
  getAccounts,
  updateAccountBalances,
} from '../actions/accounts.js';

const router = express.Router();

router.get('/balance', async (req, res) => {
  try {
    await updateAccountBalances();

    const accounts = await getAccounts();

    res.status(200).json({ data: accounts });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

export default router;