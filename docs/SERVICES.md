# Services

## Overview
A service is a third party that this app can connect to and retrieve data from or cause some effect with. For example, a service could be a bank, a credit card, or a cryptocurrency exchange. The app can connect to these services and retrieve data about the user's accounts and transactions. The app could also cause effects such as transferring money between accounts or paying a bill.

## Existing Services
  - [Teller](https://teller.io) - Connects to a bank account
  - [Plaid](https://plaid.com) - Connects to a bank account


## Creating a new service
 1. Create a new file [services/](../services)`[service name].js`
 2. Define functions in your new service that will be used to interact with it. Your service should export an object with the following properties:
  ```javascript
  export default {
    connect, // Record connection to the service
    sync: {
      // Data we will store
      transactions: syncTransactions,
      accounts: syncAccounts,
      balance: syncBalances,
    },
    get: {
      // Data we  get each time
      balance: getBalance,
      transaction: getTransaction,
      account: getAccount,
    },
    delete: {
      // Remove account from service and archive database records
      account: deleteAccount,
    }
  }
  ```
 3. Import your service in [services/index.js](../services/index.js) and add it to the services object.
 4. Create a database migration to update the accounts table `services` enum with the name of your service
 5. Add an HTML form to [web/enrollment/](../web/enrollment/) for connecting to the desired serivce.
 <!-- and add a button to [web/index.html](../web/index.html) to open the form. 
    - On submit, your form should make a POST request to `/services/enrollment` with the following body:
    ```javascript
    {
      service: 'teller',
      environment: 'sandbox|development|production',
      enrollment: {
        accessToken: '<The token provided by the service to access the enrolled account>',
      },
    }
    ```
    and have some way of getting back to the main page. -->
 6. Once an enrollment is confirmed for the service, the app calls `services[service].get.accounts()` to get all accounts associated with the enrollment. These accounts are then added to the accounts table for future use.