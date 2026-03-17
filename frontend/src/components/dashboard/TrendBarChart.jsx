import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const TrendBarChart = ({ data }) => {
  return (
    <div style={{ width: "100%", height: 350 }}>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          key={JSON.stringify(data)}   // 🔥 IMPORTANT FIX
          data={data}
        >
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" fill="#00C49F" />
          <Bar dataKey="expense" fill="#FF8042" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendBarChart;