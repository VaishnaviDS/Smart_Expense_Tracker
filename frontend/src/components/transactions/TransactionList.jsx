import { useContext, useState } from "react";
import { TransactionContext } from "../../context/TransactionContext";
import { FaEdit, FaTrash, FaSort ,FaEye} from "react-icons/fa";
import EditTransactionModal from "./EditTransactionModal";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import "./transaction.css";
import { server } from "../../main";

function TransactionList({ type }) {

  const { transactions, deleteTransaction } =
    useContext(TransactionContext);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);

  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  ////////////////////////////////////////////////////
  // FILTER
  ////////////////////////////////////////////////////

  const filtered = transactions.filter(t => {

    const matchType = t.type === type;

    const matchSearch =
      t.party?.toLowerCase()
        .includes(search.toLowerCase());

    const matchCategory =
      category === "All"
        ? true
        : t.category === category;

    return matchType && matchSearch && matchCategory;
  });

  ////////////////////////////////////////////////////
  // SORT
  ////////////////////////////////////////////////////

  const sorted = [...filtered].sort((a, b) => {

    if (sortField === "amount") {
      return sortOrder === "asc"
        ? a.amount - b.amount
        : b.amount - a.amount;
    }

    if (sortField === "party") {
      return sortOrder === "asc"
        ? a.party.localeCompare(b.party)
        : b.party.localeCompare(a.party);
    }

    if (sortField === "date") {
      return sortOrder === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    }

  });

  ////////////////////////////////////////////////////
  // PAGINATION
  ////////////////////////////////////////////////////

  const totalPages = Math.ceil(sorted.length / itemsPerPage);

  const start = (currentPage - 1) * itemsPerPage;

  const paginated = sorted.slice(
    start,
    start + itemsPerPage
  );

  ////////////////////////////////////////////////////

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="transaction-card">

      <h2>{type === "expense" ? "Expenses" : "Income"}</h2>

      <SearchBar search={search} setSearch={setSearch} />
      <CategoryFilter category={category} setCategory={setCategory} />

      <table>

        <thead>
          <tr>
            <th onClick={() => handleSort("date")}>
              Date <FaSort />
            </th>

            <th onClick={() => handleSort("party")}>
              Party <FaSort />
            </th>

            <th>Category</th>

            <th onClick={() => handleSort("amount")}>
              Amount <FaSort />
            </th>

            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginated.map(t => (
            <tr key={t._id}>
              <td>{new Date(t.date).toLocaleDateString()}</td>
              <td>{t.party}</td>
              <td>{t.category}</td>
              <td>₹{t.amount}</td>

<td>

  {/* 🔥 VIEW RECEIPT */}
  {t.receiptUrl && (
    <FaEye
      style={{ cursor: "pointer", marginRight: "10px", color: "blue" }}
      title="View Receipt"
      onClick={() =>
        window.open(
          `${server}/${t.receiptUrl}`,
          "_blank"
        )
      }
    />
  )}

  <FaEdit
    style={{ cursor: "pointer", marginRight: "10px" }}
    onClick={() => setSelected(t)}
  />

  <FaTrash
    style={{ cursor: "pointer" }}
    onClick={() => deleteTransaction(t._id)}
  />

</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="transaction-pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </button>

        <span>
          Page {currentPage} / {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {selected &&
        <EditTransactionModal
          transaction={selected}
          close={() => setSelected(null)}
        />
      }

    </div>
  );
}

export default TransactionList;