import db from '../../db.js';
import services from '../../services/index.js';

export const getAccounts = async () => {
  const {rows: accounts} = await db.file('db/accounts/get.sql');
  return accounts;
};

export const updateAccountBalances = async () => {
  const accounts = await getAccounts();

  // Check if account balances need to be updated (last updated > 1 day)
  const accounts_to_update = accounts.filter(account => !account.last_updated || account.last_updated < Date.now() - 86400000).map(account => account.x_account_id);
  if (!accounts_to_update.length) {
    return;
  }

  try {
    await services.sync.balance(accounts_to_update);
  } catch(e) {
    console.error('Failed to update account balances', e);
  }
};
