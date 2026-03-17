import { useState } from "react";
import "./transaction.css";

function TransactionModal({ data, close, onSave }) {

  const [form, setForm] = useState(data);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <div className="transaction-modal-overlay">
    <div className="transaction-modal">

      <h3>Add Transaction</h3>
            <select
        name="type"
        value={form.type}
        onChange={handleChange}
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
<label style={{ fontSize: "14px" }}>Amount:</label>
      <input
        name="amount"
        value={form.amount}
        onChange={handleChange}
        placeholder="Amount"
      />
<label style={{ fontSize: "14px" }}>Party:</label>
      <input
        name="party"
        value={form.party}
        onChange={handleChange}
        placeholder="Party"
      />
<label style={{ fontSize: "14px" }}>Category:</label>
      <input
        name="category"
        value={form.category}
        onChange={handleChange}
        placeholder="Category"
      />
<label style={{ fontSize: "14px" }}>Date:</label>
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
      />

      <button onClick={handleSubmit}>
        Save
      </button>

      <button onClick={close}>
        Cancel
      </button>

    </div>
    </div>
  );
}

export default TransactionModal;