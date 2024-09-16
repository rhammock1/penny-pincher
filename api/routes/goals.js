import express from 'express';
import { getGoals, getGoalTypes, updateGoal } from '../actions/goals.js';

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

router.patch('/:goal_id', async (req, res) => {
  const {body: {goal}, params: {goal_id}} = req;
  try {
    await updateGoal(goal_id, goal);
    res.status(200).json();
  } catch(e) {
    console.error('Failed to update goal', e);
    res.status(500).json({ error: e.message });
  }
});

export default router;