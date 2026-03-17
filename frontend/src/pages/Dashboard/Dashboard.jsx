import { useContext } from "react";
import { DashboardContext } from "../../context/DashboardContext";
import SummaryCards from "../../components/dashboard/SummaryCards";
import ExpensePieChart from "../../components/dashboard/ExpensePieChart";
import IncomePieChart from "../../components/dashboard/IncomePieChart";
import TrendBarChart from "../../components/dashboard/TrendBarChart";
import TrendLineChart from "../../components/dashboard/TrendLineChart";
import RecentTransactions from "../../components/dashboard/RecentTransactions";
import MostSpendingChart from "../../components/dashboard/MostSpendingChart";
import MostIncomeChart from "../../components/dashboard/MostIncomeChart";
import "./dashboard.css";

const Dashboard = () => {

  const {
    dashboardData,
    year,
    setYear,
    period,
    setPeriod
  } = useContext(DashboardContext);

  if (!dashboardData) return <p>Loading...</p>;

  return (

<div className="dashboard-container">

<h2 className="dashboard-title">Financial Dashboard</h2>


{/* SUMMARY */}
<div className="dashboard-summary">
  <SummaryCards summary={dashboardData.summary} />
</div>



{/* PIE CHARTS */}
<h3 className="dashboard-section-title">Expense vs Income Distribution</h3>

<div className="dashboard-grid-2">

  <div className="dashboard-card">
    <ExpensePieChart data={dashboardData.charts.expenseCategoryPie} />
  </div>

  <div className="dashboard-card">
    <IncomePieChart data={dashboardData.charts.incomeCategoryPie} />
  </div>

</div>



{/* TOP CATEGORY */}
<h3 className="dashboard-section-title">Top Categories</h3>

<div className="dashboard-grid-2">

  <div className="dashboard-card">
    <MostSpendingChart data={dashboardData.charts.topSpendingCategories} />
  </div>

  <div className="dashboard-card">
    <MostIncomeChart data={dashboardData.charts.topIncomeCategories} />
  </div>

</div>



{/* TREND SECTION */}
{/* TREND SECTION HEADER */}
<div className="trend-section-header">

  <h3 className="dashboard-section-title">Financial Trends</h3>

  <div className="dashboard-filters">

    {period !== "year" && (
      <select
        value={year || ""}
        onChange={(e) => setYear(Number(e.target.value))}
      >
        {dashboardData.availableYears?.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    )}

    <select
      value={period}
      onChange={(e) => setPeriod(e.target.value)}
    >
      <option value="month">Month</option>
      <option value="quarter">Quarter</option>
      <option value="year">Year</option>
    </select>

  </div>

</div>


{/* TREND CHARTS */}
<div className="dashboard-grid-2">

  <div className="dashboard-card">
    <TrendBarChart data={dashboardData.charts.trend} />
  </div>

  <div className="dashboard-card">
    <TrendLineChart data={dashboardData.charts.trend} />
  </div>

</div>



{/* RECENT TRANSACTIONS */}
<h3 className="dashboard-section-title">Recent Transactions</h3>

<div className="dashboard-card dashboard-recent">
  <RecentTransactions data={dashboardData.recentTransactions} />
</div>

</div>

  );
};

export default Dashboard;