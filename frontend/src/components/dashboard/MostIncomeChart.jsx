import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const MostIncomeChart = ({ data }) => {

  const chartData = data.map((item) => ({
    category: item._id,
    amount: item.total
  }));

  return (
    <div className="dashboard-card">
      <h3 className="dashboard-chart-title">Top Income Categories</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="category" />

          <YAxis />

          <Tooltip formatter={(value) => `₹${value}`} />

          <Bar
            dataKey="amount"
            radius={[6,6,0,0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MostIncomeChart;