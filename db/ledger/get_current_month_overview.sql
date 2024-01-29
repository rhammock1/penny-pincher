SELECT  
  COALESCE(ROUND(SUM(CASE WHEN l.amount > 0 THEN (l.amount / 100) ELSE 0 END), 2), 0) AS income,
  COALESCE(ROUND(SUM(CASE WHEN l.amount < 0 THEN ABS(l.amount / 100) ELSE 0 END), 2), 0) AS expenses
FROM current_month_ledger_view l;