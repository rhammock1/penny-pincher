import db from '../../db.js';

export const getGoals = async () => {
  const { rows: goals } = await db.file('db/goals/get.sql');
  return goals;
};

export const getGoalTypes = async () => {
  const {rows: goal_types} = await db.file('db/get_enum.sql', {enum: 'goal_type'});
  return goal_types;
};

export const updateGoal = async (goal_id, goal) => {
  await db.file('db/goals/patch.sql', {goal_id, ...goal});
  return;
};

export const archiveGoal = async (goal_id) => {
  await db.file('db/goals/archive.sql', {goal_id});
  return;
};