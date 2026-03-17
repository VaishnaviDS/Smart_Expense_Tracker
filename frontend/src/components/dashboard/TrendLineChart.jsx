import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const TrendLineChart = ({ data }) => {
  return (
    <div style={{ width: "100%", height: 350 }}>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          key={JSON.stringify(data)}   // 🔥 IMPORTANT FIX
          data={data}
        >
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#00C49F" />
          <Line type="monotone" dataKey="expense" stroke="#FF8042" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendLineChart;