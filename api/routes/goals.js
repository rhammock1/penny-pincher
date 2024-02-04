import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = [];
    res.status(200).json({ data });
  } catch (e) {
    console.error('Failed to GET /goals', e);
    res.status(500).json({ error: e.message });
  }
});

export default router;