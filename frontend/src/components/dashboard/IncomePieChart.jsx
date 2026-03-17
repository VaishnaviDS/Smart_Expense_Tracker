import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend
} from "recharts";

const COLORS = [
  "#6366F1",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#3B82F6",
  "#8B5CF6"
];

const IncomePieChart = ({ data }) => {

  const totalIncome = data.reduce((sum, item) => sum + item.total, 0);

  const renderLabel = ({ percent }) =>
    `${(percent * 100).toFixed(0)}%`;

  return (
    <div style={{ width: "100%", height: 320 }}>

      <h4 style={{ marginBottom: "10px" }}>Income by Category</h4>

      <ResponsiveContainer>
        <PieChart>

          <Pie
            data={data}
            dataKey="total"
            nameKey="_id"
            cx="50%"
            cy="50%"
            innerRadius={60}   // donut effect
            outerRadius={100}
            label={renderLabel}
            labelLine={false}
          >

            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}

          </Pie>

          <Tooltip
            formatter={(value) => `₹ ${value}`}
          />

          <Legend
            verticalAlign="bottom"
            height={36}
          />

        </PieChart>
      </ResponsiveContainer>

      <div
        style={{
          textAlign: "center",
          marginTop: "-160px",
          fontWeight: "600",
          fontSize: "16px"
        }}
      >
        Total <br /> ₹{totalIncome}
      </div>

    </div>
  );
};

export default IncomePieChart;