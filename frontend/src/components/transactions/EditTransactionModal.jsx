import { useState, useContext } from "react";
import { TransactionContext } from "../../context/TransactionContext";
import "./transaction.css";

function EditTransactionModal({ transaction, close }) {

  const { editTransaction } =
    useContext(TransactionContext);

  const [form, setForm] =
    useState(transaction);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async () => {
    await editTransaction(form._id, form);
    close();
  };

  return (
    <div className="transaction-modal-overlay">
   <div className="transaction-modal">

      <h3>Edit Transaction</h3>
<label style={{ fontSize: "14px" }}>Amount:</label>
      <input
        name="amount"
        value={form.amount}
        onChange={handleChange}
      />
<label style={{ fontSize: "14px" }}>Party:</label>
      <input
        name="party"
        value={form.party}
        onChange={handleChange}
      />
<label style={{ fontSize: "14px" }}>Category:</label>
      <input
        name="category"
        value={form.category}
        onChange={handleChange}
      />

      <button onClick={handleUpdate}>
        Update
      </button>

      <button onClick={close}>
        Cancel
      </button>

    </div>
    </div>
  );
}

export default EditTransactionModal;