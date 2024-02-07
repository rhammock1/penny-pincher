// ALL CUSTOM COMPONENTS MUST BE IMPORTED HERE

// Dashboard Components
import GraphCarousel from "./cards/graph-carousel.js";
import LedgerOverview from "./cards/ledger-overview.js";
import AccountBalances from "./cards/account-balances.js";
import PieChart from "./charts/pie-chart.js";
import LineChart from "./charts/line-chart.js";
import TableChart from "./charts/table-chart.js";

// General/View Components
import AppWrapper from "./app-wrapper.js";
import ClassifyTransactions from "./cards/classify-transactions.js";
import ServiceEnrollment from "./cards/service-enrollment.js";
import FinancialGoals from "./cards/financial-goals/financial-goals.js";
import NoData from "./no-data.js";

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
  FinancialGoals,
  NoData,
};
