import express from 'express';
import {
  getTransactions,
  organizeSpending,
  organizeSpendingByCategory,
  getOverview,
  getSpendingTransactions,
  getUnknownTransactions,
} from '../actions/ledger.js';
import {
  getClassifiers,
  getClassifierTypes,
  insertClassification,
} from '../actions/classifiers.js';

const router = express.Router();

router.get('/overview', async (req, res) => {
  const { granularity, start_date, end_date } = req.query;
  try {
    const data = await getOverview(granularity, start_date, end_date);
    res.status(200).json({ data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// router.get('/categories/overview', async (req, res) => {
//   const overview = await getOverview(true);
//   res.status(200).json({ ...overview, request: req.originalUrl });
// });

router.get('/spending/:granularity(category|date|month)', async (req, res) => {
  const { granularity } = req.params;
  const { start_date, end_date } = req.query;

  let data = [];
  if (granularity === 'category') {
    // get spending by category
    const transactions = await getSpendingTransactions();
    data = organizeSpending('category', transactions);
  } else if (granularity === 'date') {
    // get spending by time period
    if (!start_date || !end_date) {
      return res.status(400).json({ error: 'start_date and end_date query params are required' });
    }
    const transactions = await getSpendingTransactions(start_date, end_date);
    data = organizeSpending('date', transactions);
  } else {
    // get spending by the selected month
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({ error: 'month query param is required' });
    }
    console.log('spending by month', month);
  }
  res.status(200).json({ data });
});

router.get('/transactions', async (req, res) => {
  // Optional params for date range
  const { start_date, end_date } = req.query;
  const transactions = await getTransactions(start_date, end_date);
  res.status(200).json({ data: { transactions } });
});

router.route('/classify')
  .get(async (req, res) => {
    // Get all unknown transactions and the classifiers enum
    const unknown_transactions = await getUnknownTransactions();
    const classifier_types = await getClassifierTypes();

    res.status(200).json({data: {classifier_types, unknown_transactions}});
  })
  .post(async (req, res) => {
    // Update unknown transactions with a classifier
    // Request made for each transaction
    const {classifiers_to_insert} = req.body;

    try {
      await Promise.all(classifiers_to_insert.map(c => insertClassification(c)));
    } catch (e) {
      console.error(e);
      return res.status(500).json({error: e.message});
    }

    const unknown_transactions = await getUnknownTransactions();

    return res.status(200).json({data: {unknown_transactions}});
  });

export default router;
