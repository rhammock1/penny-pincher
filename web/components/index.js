// ALL CUSTOM COMPONENTS MUST BE IMPORTED HERE

// Dashboard Components
import GraphCarousel from "./graph-carousel.js";
import LedgerOverview from "./ledger-overview.js";
import AccountBalances from "./account-balances.js";
import PieChart from "./charts/pie-chart.js";
import LineChart from "./charts/line-chart.js";
import TableChart from "./charts/table-chart.js";

// General/View Components
import AppWrapper from "./app-wrapper.js";
import ClassifyTransactions from "./classify-transactions.js";
import ServiceEnrollment from "./service-enrollment.js";

// Export isn't necessary, but I don't like the unused variable warning
export default {
  GraphCarousel,
  LedgerOverview,
  PieChart,
  LineChart,
  AccountBalances,
  TableChart,
  AppWrapper,
  ClassifyTransactions,
  ServiceEnrollment,
};
