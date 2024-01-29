# Budget Tracking Web App

## Description
This web app will be served locally and will track as much as my financial data as possible. Using different services, it will track account balances, cache transactions in the database, and calculate metrics. It is intended to be easily extensible to include new services and metrics. The front end is served statically and the back end is a REST API and database.

## App Goals
* Track transactions and balances across all accounts
* Do something interesting with that data
* Write the web app in a way that it requires as few external dependencies as possible
* Write the web app in a way that it can be easily expanded to include new functionality and metrics
* Changes made to the front-end only require a page refresh to become visible
* Changes to the server only requires a restart, no build step.

## Dependencies
* Node.js
* Express
* PostgreSQL

## Endpoints
<!-- See [ENDPOINTS](./docs/ENDPOINTS.md) for all endpoints. -->
 - `/ledger/overview` 
   - GET - Returns totals and sums for all transaction categories
 - `/ledger/transactions?start_date=f&end_date=f` 
   - GET - Returns a list of all transactions. Query param optional
 - `/ledger/spending:granularity?start_date=f&end_date=f` 
   - GET - Returns a list of all transactions grouped by granularity. Query param optional
 - `/accounts/balance` 
   - GET - Requests the balances from all accounts.
 - `/services/sync` 
   - GET - Syncs all services with the database
 - `/services/enrollment`
   - POST - Records enrollment of an account with a service

 ~~- `/upload`~~ 
   ~~- POST - Uploads a CSV file of transactions. CSV must have no headers and be in the format of `date, amount, null, null, description`~~

## Running the app
```bash
  npm install
  createdb budget
  psql -c "CREATE TABLE db_versions(db_version INTEGER PRIMARY KEY, created TIMESTAMPTZ DEFAULT NOW())" -d budget
  npm start
```
NOTE: You will need an enrollments/ folder in the web directory to connect your accounts to services. See [SERVICES](./docs/SERVICES.md) for more information.

## Services
See [SERVICES](./docs/SERVICES.md) for all services and documentation on how to add new ones

## Metrics
See [METRICS](./docs/METRICS.md) for all metrics and documentation on how to add new ones
