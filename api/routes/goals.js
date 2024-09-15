import express from 'express';
import { getGoals, getGoalTypes } from '../actions/goals.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const goals = await getGoals();
    const goal_types = await getGoalTypes();
    res.status(200).json({ data: {goals, goal_types} });
  } catch (e) {
    console.error('Failed to GET /goals', e);
    res.status(500).json({ error: e.message });
  }
});

export default router;