const RecentTransactions = ({ data }) => {

const recent = data?.slice(0,10) || [];

return (

<div className="dashboard-recent-transactions">

<div className="recent-header">
<h4>Recent Transactions</h4>
</div>

{recent.length === 0 ? (

<p className="no-transactions">No recent transactions</p>

) : (

<table>

<thead>
<tr>
<th>Date</th>
<th>Category</th>
<th>Type</th>
<th>Amount</th>
</tr>
</thead>

<tbody>

{recent.map((tx) => (

<tr key={tx._id}>

<td className="tx-date">
{new Date(tx.date).toLocaleDateString()}
</td>

<td className="tx-category">
{tx.category}
</td>

<td>
<span className={`tx-type ${tx.type}`}>
{tx.type}
</span>
</td>

<td className={`tx-amount ${tx.type}`}>
₹{tx.amount}
</td>

</tr>

))}

</tbody>

</table>

)}

</div>

);

};

export default RecentTransactions;