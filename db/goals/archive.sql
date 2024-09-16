UPDATE goals
SET archived = NOW()
WHERE goal_id = ${goal_id};
