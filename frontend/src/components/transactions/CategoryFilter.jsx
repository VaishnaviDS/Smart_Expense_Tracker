import { useContext } from "react";
import { TransactionContext } from "../../context/TransactionContext";
import "./transaction.css";

function CategoryFilter({ category, setCategory }) {

  const { transactions } = useContext(TransactionContext);

  // Extract unique categories
  const categories = [
    "All",
    ...new Set(
      transactions
        .map(t => t.category)
        .filter(Boolean)
    )
  ];

  return (
    <div className="transaction-category-filter">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {categories.map((c, index) => (
          <option key={index} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CategoryFilter;