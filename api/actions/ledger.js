import db from '../../db.js';

/**
 * @description Get spending overview
 * @param {string} start_date
 * @param {string} end_date
 * @returns 
 */
export const getOverview = async (granularity, start_date, end_date) => {
  let overview;
  if(granularity === 'month') {
    ({rows: [overview]} = await db.file('db/ledger/get_current_month_overview.sql'));
  } else {
    ({rows: [overview]} = await db.file(`db/ledger/get_overview.sql`, {start_date, end_date}));
  }
  return overview;
}

export const getSpendingTransactions = async (start_date, end_date) => {
  const {rows: transactions} = await db.file('db/ledger/get_spending.sql', {
    start_date,
    end_date,
  });
  return transactions;
}

export const organizeSpending = (type, transactions) => {
  if(type === 'category') {
    return organizeSpendingByCategory(transactions);
  } else if(type === 'date') {
    return organizeSpendingByDate(transactions);
  }
}

export const organizeSpendingByCategory = (transactions) => {
  const spending_by_category = {};
  for(const transaction of transactions) {
    spending_by_category[transaction.type] = spending_by_category[transaction.type] || {total: 0, transactions: []};
    spending_by_category[transaction.type].total += parseInt(transaction.amount);
    spending_by_category[transaction.type].transactions.push(transaction);
  }

  // Convert totals to dollars
  for(const category in spending_by_category) {
    spending_by_category[category].total = (spending_by_category[category].total / 100).toFixed(2);
  }

  return spending_by_category;
};

const organizeSpendingByDate = (transactions) => {
  const spending_by_date = {};
  for(const transaction of transactions) {
    spending_by_date[transaction.fiscal_day] = spending_by_date[transaction.fiscal_day] || {total: 0, transactions: []};
    spending_by_date[transaction.fiscal_day].total += parseInt(transaction.amount);
    spending_by_date[transaction.fiscal_day].transactions.push(transaction);
  }

  // Convert totals to dollars
  for(const date in spending_by_date) {
    spending_by_date[date].total = (spending_by_date[date].total / 100).toFixed(2);
  }

  return spending_by_date;
};

export const handleCSVUpload = async (csv) => {
  // Parse CSV
  let csv_data = [];
  try {
    csv_data = csv.split('\n').map((row) => {
      if(row === '') {
        return;
      }

      const [date, base_amount, , , description] = row.split(',').map(col => col.replaceAll('"', ''));

      const amount = Math.round(parseFloat(base_amount) * 100);
      if(isNaN(amount)) {
        throw new Error(`Invalid amount: ${base_amount}: ${amount}`);
      }

      return {fiscal_day: date, amount, description};
    }).filter(Boolean);
  } catch (e) {
    console.error(e);
    return;
  }

  // Insert into DB
  if(csv_data.length) {
    await db.file('db/ledger/insert.sql', {ledger_json: JSON.stringify(csv_data)});
  }

  return;
};

export const getTransactions = async (start_date, end_date) => {
  const {rows: transactions} = await db.file('db/ledger/get_all.sql', {start_date, end_date});
  return transactions;
};

export const getUnknownTransactions = async () => {  
  const {rows: unknown_transactions} = await db.file('db/ledger/get_unknown_transactions.sql');
  return unknown_transactions;
}
