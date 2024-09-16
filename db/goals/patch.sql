UPDATE goals
SET goal_name = COALESCE(${goal_name}, goal_name),
  goal_amount = COALESCE(${goal_amount}, goal_amount),
  goal_type = COALESCE(${goal_type}, goal_type),
  target_date = COALESCE(${target_date}, target_date),
  classifier_ids = COALESCE(${classifier_ids}, classifier_ids)
WHERE goal_id = ${goal_id};
