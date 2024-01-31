import https from 'https';
import fs from 'fs';
import path from 'path';
import db from '../db.js';

const tellerRequest = async (endpoint, method, body = {}, x_access_token) => {
  const promise = new Promise(async (resolve, reject) => {
    const __dirname = path.dirname(new URL(import.meta.url).pathname);


    const [cert, key] = await Promise.all([
      fs.readFileSync(path.join(__dirname, '../bin/certificate.pem')),
      fs.readFileSync(path.join(__dirname, '../bin/private_key.pem')),
    ]);

    const options = {
      cert,
      key,
      host: 'api.teller.io',
      port: 443,
      path: endpoint,
      method,
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Basic ${Buffer.from(`${x_access_token}:`).toString('base64')}`,
      },
    };

    let request_response;
    try {
      const req = https.request(options, (res) => {
        let response = []
        res.on('data', (chunk) => {
          response.push(chunk)
        })
        res.on('end', () => {
          const body = Buffer.concat(response);
          request_response = JSON.parse(body.toString());
          resolve(request_response);
        })
        res.on('error', (err) => {
          console.error('Error in HTTP response', err);
          reject(err);
        })
      });

      req.on('error', (err) => {
        console.error('Error in HTTP request', err);
        reject(err)
      });
  
      if (Object.keys(body).length) {
        const requestBody = JSON.stringify(body)
        req.write(requestBody)
      }
  
      req.end();
    } catch(e) {
      console.error('Error making tellerRequest', e)
      throw err;
    }
  });

  const result = await promise.catch((err) => {
    // console.error('Error in tellerRequest', err);
    throw err;
  });

  return result;
}

const format = {
  transactions: (transactions) => {
    const formatted = transactions.reduce((acc, tran) => {
      acc = acc || [];
      const {
        id: x_transaction_id,
        account_id: x_account_id,
        description,
        date: fiscal_day,
        amount,
      } = tran;
      
      acc.push({
        x_transaction_id,
        x_account_id,
        description,
        fiscal_day,
        amount: Math.round(parseFloat(amount).toFixed(2) * 100),
      });
      return acc;
    }, []);
    return formatted;
  },
  balances: (balances) => balances.map(bal => ({ balance: bal.available, x_account_id: bal.account_id })),
};

/**
 * @description Syncs transactions in the database for all accounts
 * @returns 
 */
const syncTransactions = async () => {
  try {
    const {rows: accounts} = await db.file('db/accounts/get_by_service.sql', {service: 'teller'});
    console.log('accounts', accounts);
    for(const account of accounts) {
      const { x_account_id, x_access_token } = account;
      const response = await tellerRequest(`/accounts/${x_account_id}/transactions`, 'GET', {}, x_access_token);
      // add the records to the database
      const transactions = format.transactions(response);
      console.log('transactions', transactions);
      await db.file('db/ledger/put_bulk_transactions.sql', { transactions: JSON.stringify(transactions) });
    }
    return true;
  } catch(err) {
    console.error('Error syncing transactions', err);
    return false;
  }
}

const getAccounts = async (x_access_token) => {
  const response = await tellerRequest('/accounts', 'GET', {}, x_access_token);
  return response;
}

const getAccountBalances = async (x_account_ids) => {
  // Get accounts from the database
  const {rows: accounts} = await db.file('db/accounts/get_by_service.sql', {
    service: 'teller',
    x_account_ids: x_account_ids?.length ? x_account_ids : null,
  });
  // Make a request for the balances of each account (or sub-account)
  const balances = await Promise.all(accounts.map(async (account) => {
    const { x_account_id, x_access_token } = account;
    const response = await tellerRequest(`/accounts/${x_account_id}/balances`, 'GET', {}, x_access_token);
    return response;
  }));
  return balances;
}

/**
 * @description Fetches account balances and updates the database if the balance was last checked > 1 day ago
 */
const syncBalances = async (x_account_ids) => {
  const balances = await getAccountBalances(x_account_ids);
  console.log('balances', balances);
  const formatted = format.balances(balances);
  await Promise.all(formatted.map(async f => db.file('db/accounts/patch_balance.sql', {...f})));
}

export default {
  sync: {
    transactions: syncTransactions,
    balance: syncBalances,
  },
  get: {
    accounts: getAccounts,
    balance: getAccountBalances,
  },
  request: tellerRequest,
}
