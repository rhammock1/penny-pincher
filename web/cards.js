import { currency } from "./utils.js";

export default [
  {
    title: 'All Time Overview',
    request: '/ledger/overview',
    visible: true,
    graphs: null,
    component: 'ledger-overview',
  },
  {
    title: 'Current Month Overview',
    request: '/ledger/overview?granularity=month',
    visible: true,
    graphs: null,
    component: 'ledger-overview',
  },
  {
    title: '{{start_date}} to {{end_date}} Overview',
    request: '/ledger/overview?start_date={{start_date}}&end_date={{end_date}}',
    visible: true,
    graphs: null,
    component: 'ledger-overview',
  },
  {
    title: 'Account Balances',
    request: '/accounts/balance',
    visible: true,
    graphs: null,
    component: 'account-balances',
  },
  {
    title: 'Spending by Category',
    request: '/ledger/spending/category?start_date={{start_date}}&end_date={{end_date}}',
    visible: true,
    graphs: [
      { 
        type: 'pie', 
        visible: true,
        canvas_height: 400,
        canvas_width: 700,
        radius: 100,
        format: data => Object.entries(data).map(([label, { total }]) => ({ label, value: total })),
      },
      // { 
      //   type: 'line', 
      //   visible: true,
      //   format: data => Object.entries(data).map(([label, { total }]) => ({ label, value: total })),
      // },
    ],
    component: 'graph-carousel',
  },
  {
    title: 'Spending by Time Period',
    request: '/ledger/spending/date?start_date={{start_date}}&end_date={{end_date}}',
    visible: true,
    graphs: [
      { 
        type: 'pie', 
        visible: true,
        canvas_height: 400,
        canvas_width: 700,
        radius: 100,
        format: data => Object.entries(data)
          .sort(([a_label], [b_label]) => a_label.localeCompare(b_label))
          .map(([label, { total }]) => ({ label, value: total })),
      },
      { 
        type: 'line', 
        visible: true,
        canvas_height: 400,
        canvas_width: 700,
        format: data => Object.entries(data)
          .sort(([a_label], [b_label]) => a_label.localeCompare(b_label))
          .map(([label, { total }]) => ({ label, value: total })),
      },
    ],
    component: 'graph-carousel',
  },
  {
    title: 'Transactions',
    request: '/ledger/transactions?start_date={{start_date}}&end_date={{end_date}}',
    visible: true,
    graphs: [
      {
        type: 'table',
        visible: true,
        format: ({transactions}) => transactions.map(t => ({...t, amount: `${currency.format((t.amount / 100).toFixed(2))}`})),
        columns: {
          description: 'Description',
          amount: 'Amount',
          fiscal_day: 'Fiscal Day',
          descriptor: 'Classifier Descriptor',
        },
      },
    ],
    component: 'graph-carousel',
  },
  {
    title: 'Classify Transactions',
    request: '/ledger/classify',
    visible: false, // Hide this card by default
    view: 'classify',
    component: 'classify-transactions',
  },
  {
    title: 'Connect Accounts',
    request: '/services/available',
    visible:  false, // Hide this card by default
    view: 'connect',
    component: 'service-enrollment',
  },
  {
    title: 'Financial Goals',
    request: '/goals',
    visible: false, // Hide this card by default
    view: 'goals',
    component: 'financial-goals',
  },
];