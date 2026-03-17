import { useState } from "react";

function PreviewTransactionsModal({ data, close, onConfirm }) {

  const [transactions, setTransactions] = useState(data);

  const handleChange = (index, field, value) => {
    const updated = [...transactions];
    updated[index][field] = value;
    setTransactions(updated);
  };

  const handleDelete = (index) => {
    const updated = transactions.filter((_, i) => i !== index);
    setTransactions(updated);
  };

  const handleConfirm = () => {
    onConfirm(transactions);
  };

  return (
    <div className="transaction-modal-overlay">
      <div className="transaction-modal preview-modal">
        <h2>{transactions.length} Transactions Detected</h2>

        {transactions.map((txn, index) => (
          <div key={index} className="preview-item">

            <select
              value={txn.type}
              onChange={(e) =>
                handleChange(index, "type", e.target.value)
              }
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
<label style={{ fontSize: "14px" }}>Amount:</label>
            <input
              type="number"
              value={txn.amount}
              onChange={(e) =>
                handleChange(index, "amount", e.target.value)
              }
            />
<label style={{ fontSize: "14px" }}>Party:</label>
            <input
              type="text"
              value={txn.party}
              onChange={(e) =>
                handleChange(index, "party", e.target.value)
              }
            />
<label style={{ fontSize: "14px" }}>Category:</label>
            <input
              type="text"
              value={txn.category}
              onChange={(e) =>
                handleChange(index, "category", e.target.value)
              }
            />
<label style={{ fontSize: "14px" }}>Date:</label>
            <input
              type="date"
              value={txn.date}
              onChange={(e) =>
                handleChange(index, "date", e.target.value)
              }
            />

            <button onClick={() => handleDelete(index)}>
              Delete
            </button>
          </div>
        ))}

        <div className="modal-actions">
          <button onClick={close}>Cancel</button>
          <button onClick={handleConfirm}>Add All</button>
        </div>

      </div>
    </div>
  );
}

export default PreviewTransactionsModal;