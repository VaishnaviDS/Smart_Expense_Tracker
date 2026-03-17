import { FaWallet, FaArrowUp, FaArrowDown, FaChartLine } from "react-icons/fa";

const SummaryCards = ({ summary }) => {

const cards = [

{
title: "Total Income",
value: summary.totalIncome,
icon: <FaArrowUp />,
className: "income"
},

{
title: "Total Expense",
value: summary.totalExpense,
icon: <FaArrowDown />,
className: "expense"
},

{
title: "Net Balance",
value: summary.netBalance,
icon: <FaWallet />,
className: "balance"
},

{
title: "This Month Income",
value: summary.monthlyIncome,
icon: <FaChartLine />,
className: "month-income"
},

{
title: "This Month Expense",
value: summary.monthlyExpense,
icon: <FaChartLine />,
className: "month-expense"
}

];

return (

<div className="dashboard-summary-grid">

{cards.map((card,index)=>(
  
<div key={index} className={`dashboard-card-summary ${card.className}`}>

<div className="summary-icon">
{card.icon}
</div>

<div className="summary-title">
{card.title}
</div>

<div className="summary-value">
₹{card.value}
</div>

</div>

))}

</div>

);

};

export default SummaryCards;