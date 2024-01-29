import db from '../db.js';
import teller from './teller.js';
import plaid from './plaid.js';

const services = {
  teller,
  plaid,
};

/**
 * Returns an object containing service functions that match the provided function path.
 * The function path is split into a method and a resource, and these are used to look up the service functions.
 * If no service functions are found that match the function path, an error is thrown.
 *
 * @param {string} fxn_path - The function path, in the format 'method.resource'.
 * @returns {object} An object containing the matching service functions. The keys are the service names, and the values are the service functions.
 * @throws {Error} Will throw an error if no service function is found for the provided function path.
 */
const getServiceFunction = (fxn_path) => {
  const eligibleServices = Object.keys(services);
  // Only works for 1 level deep
  const [method, resource] = fxn_path.split('.');

  const fxns = {};
  for(const key of eligibleServices) {
    if (services[key][method]?.[resource]) {
      fxns[key] = services[key][method][resource];
    }
  }

  if(!Object.keys(fxns).length) {
    throw new Error(`No service function found for ${fxn_path}`);
  }

  return fxns;
}

const syncTransactions = async () => {
  const fxns = getServiceFunction('sync.transactions');
  const responses = {};
  await Promise.all(Object.entries(fxns).map(async ([key, fxn]) => {
    try {
      const result = await fxn();
      responses[key] = result;
      return result;
    } catch (e) {
      console.error('Error in services.sync.transactions', e);
      return;
    }
  }));

  console.log('responses', responses);

  return responses;
};


const syncAccounts = async () => {};

const getTransaction = async () => {};

const getAccount = async () => {};

const getBalance = async () => {
  const fxns = getServiceFunction('get.balance');

  const responses = {};
  await Promise.all(Object.entries(fxns).map(async ([key, fxn]) => {
    try {
      const result = await fxn();
      responses[key] = result;
      return result;
    } catch (e) {
      console.error('Error in services.get.balance', e);
      return;
    }
  }));

  console.log('responses', responses);

  return responses;
};

const syncBalances = async (x_account_ids) => {
  const fxns = getServiceFunction('sync.balance');

  const responses = {};
  await Promise.all(Object.entries(fxns).map(async ([key, fxn]) => {
    try {
      const result = await fxn(x_account_ids);
      responses[key] = result;
      return result;
    } catch(e) {
      console.error('Error in services.sync.balance', e);
      return;
    }
  }));
}

const deleteAccount = async () => {};

// This is specific to Teller at the moment.
const connect = async (enrollment, service, environment) => {
  let accounts = {};
  try {
    const response = await services[service].get.accounts(enrollment.accessToken);
    for(const account of response) {
      accounts[account.id] = {
        institution: account.institution.name,
        x_name: `${account.subtype.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())} ...${account.last_four}`,
        x_access_token: enrollment.accessToken,
      }
    }
  } catch(err) {
    console.error('Error connecting to service', err);
    return false;
  }


  await Promise.all(Object.keys(accounts).map(x_account_id => db.file('db/accounts/insert.sql', {
    service,
    x_account_id,
    environment,
    x_access_token: accounts[x_account_id].x_access_token,
    institution: accounts[x_account_id].institution,
    x_name: accounts[x_account_id].x_name
  })));

  return true;
};

export default {
  services,
  connect,
  sync: {
    // Data we will store
    transactions: syncTransactions,
    accounts: syncAccounts,
    balance: syncBalances,
  },
  get: {
    // Data we will get each time
    balance: getBalance,
    transaction: getTransaction,
    account: getAccount,
  },
  delete: {
    account: deleteAccount,
  }
}
