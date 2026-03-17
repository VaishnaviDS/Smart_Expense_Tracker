import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";

export const getTransactionDashboard = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const year = parseInt(req.query.year) || new Date().getFullYear();
    const period = req.query.period || "month";

    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59);

    //////////////////////////////////////////////////////
    // 🔹 CURRENT MONTH RANGE
    //////////////////////////////////////////////////////
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    //////////////////////////////////////////////////////
    // 🔹 AVAILABLE YEARS
    //////////////////////////////////////////////////////
    const years = await Transaction.aggregate([
      { $match: { user: userId } },
      { $group: { _id: { $year: "$date" } } },
      { $sort: { _id: -1 } }
    ]);

    const availableYears = years.map(y => y._id);

    //////////////////////////////////////////////////////
    // 🔹 TOTAL SUMMARY (ALL TIME)
    //////////////////////////////////////////////////////
    const totals = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" }
        }
      }
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    totals.forEach(t => {
      if (t._id === "income") totalIncome = t.total;
      if (t._id === "expense") totalExpense = t.total;
    });

    //////////////////////////////////////////////////////
    // 🔹 THIS MONTH SUMMARY
    //////////////////////////////////////////////////////
    const monthlyTotals = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" }
        }
      }
    ]);

    let monthlyIncome = 0;
    let monthlyExpense = 0;

    monthlyTotals.forEach(t => {
      if (t._id === "income") monthlyIncome = t.total;
      if (t._id === "expense") monthlyExpense = t.total;
    });

    //////////////////////////////////////////////////////
    // 🔹 TREND
    //////////////////////////////////////////////////////
    let groupId;

    if (period === "month") {
      groupId = {
        label: { $month: "$date" },
        type: "$type"
      };
    } else if (period === "quarter") {
      groupId = {
        label: { $ceil: { $divide: [{ $month: "$date" }, 3] } },
        type: "$type"
      };
    } else {
      groupId = {
        label: { $year: "$date" },
        type: "$type"
      };
    }

    const matchStage =
      period === "year"
        ? { user: userId }
        : {
            user: userId,
            date: { $gte: startOfYear, $lte: endOfYear }
          };

    const trendRaw = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: groupId,
          total: { $sum: "$amount" }
        }
      }
    ]);

    //////////////////////////////////////////////////////
    // 🔹 BUILD LABELS
    //////////////////////////////////////////////////////
    let labels = [];

    if (period === "month") {
      labels = [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
      ];
    } else if (period === "quarter") {
      labels = ["Q1","Q2","Q3","Q4"];
    } else {
      labels = availableYears.map(y => y.toString());
    }

    const trend = labels.map((label, index) => {
      const lookupValue =
        period === "year"
          ? parseInt(label)
          : index + 1;

      const incomeData = trendRaw.find(
        t => t._id.label === lookupValue && t._id.type === "income"
      );

      const expenseData = trendRaw.find(
        t => t._id.label === lookupValue && t._id.type === "expense"
      );

      return {
        label,
        income: incomeData ? incomeData.total : 0,
        expense: expenseData ? expenseData.total : 0
      };
    });

    //////////////////////////////////////////////////////
    // 🔹 PIE CHARTS
    //////////////////////////////////////////////////////
    const expenseCategoryPie = await Transaction.aggregate([
      { $match: { user: userId, type: "expense" } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      },
      { $sort: { total: -1 } }
    ]);

    const incomeCategoryPie = await Transaction.aggregate([
      { $match: { user: userId, type: "income" } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      },
      { $sort: { total: -1 } }
    ]);

    const topSpendingCategories = await Transaction.aggregate([
  {
    $match: {
      user: userId,
      type: "expense"
    }
  },
  {
    $group: {
      _id: "$category",
      total: { $sum: "$amount" }
    }
  },
  { $sort: { total: -1 } },
  { $limit: 5 } // top 5 spending categories
]);

const topIncomeCategories = await Transaction.aggregate([
  {
    $match: {
      user: userId,
      type: "income"
    }
  },
  {
    $group: {
      _id: "$category",
      total: { $sum: "$amount" }
    }
  },
  { $sort: { total: -1 } },
  { $limit: 5 }
]);
    //////////////////////////////////////////////////////
    // 🔹 RECENT TRANSACTIONS
    //////////////////////////////////////////////////////
    const recentTransactions = await Transaction
      .find({ user: userId })
      .sort({ date: -1 })
      .limit(6);

    //////////////////////////////////////////////////////
    // 🔹 FINAL RESPONSE
    //////////////////////////////////////////////////////
    res.json({
  availableYears,
  summary: {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    monthlyIncome,
    monthlyExpense
  },
charts: {
  expenseCategoryPie,
  incomeCategoryPie,
  trend,
  topSpendingCategories,
  topIncomeCategories
},
  recentTransactions
});

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: error.message });
  }
};
