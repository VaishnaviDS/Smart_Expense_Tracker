import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend
} from "recharts";

const COLORS = [
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6"
];

const ExpensePieChart = ({ data }) => {

  const totalExpense = data.reduce((sum, item) => sum + item.total, 0);

  const renderLabel = ({ percent }) =>
    `${(percent * 100).toFixed(0)}%`;

  return (
    <div style={{ width: "100%", height: 320 }}>

      <h4 style={{ marginBottom: "10px" }}>Expense by Category</h4>

      <ResponsiveContainer>
        <PieChart>

          <Pie
            data={data}
            dataKey="total"
            nameKey="_id"
            cx="50%"
            cy="50%"
            innerRadius={60}
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
        Total <br /> ₹{totalExpense}
      </div>

    </div>
  );
};

export default ExpensePieChart;