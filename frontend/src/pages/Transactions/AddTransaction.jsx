import { useState, useContext } from "react";
import { TransactionContext } from "../../context/TransactionContext";
import TransactionList from "../../components/transactions/TransactionList";
import TransactionModal from "../../components/transactions/TransactionModal";
import PromptModal from "../../components/transactions/PromptModel";
import PreviewTransactionsModal from "../../components/transactions/PreviewTransactionsModel";

function AddTransaction() {

  const {
    createManualTransaction,
    createTransactionFromTextAI,
    uploadTransactionReceiptAI,
    createBulkTransactions
  } = useContext(TransactionContext);

  const [type, setType] = useState("expense");
  const [showManualModal, setShowManualModal] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState([]);

  // 🔥 Loading state
  const [uploading, setUploading] = useState(false);

  ////////////////////////////////////////////////////
  // MANUAL OPEN
  ////////////////////////////////////////////////////

  const openManualModal = () => {
    setModalData({
      type,
      amount: "",
      party: "",
      category: "",
      date: new Date().toISOString().split("T")[0]
    });
    setShowManualModal(true);
  };

  ////////////////////////////////////////////////////
  // SAVE
  ////////////////////////////////////////////////////

  const saveTransaction = async (data) => {
    await createManualTransaction(data);
    setShowManualModal(false);
    setModalData(null);
  };

  ////////////////////////////////////////////////////
  // AI PROMPT
  ////////////////////////////////////////////////////

  const handlePromptSubmit = async (prompt) => {

    const extracted = await createTransactionFromTextAI(prompt);
    if (!extracted || extracted.length === 0) return;

    const normalized = extracted.map(item => ({
      ...item,
      date: item.date
        ? new Date(item.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0]
    }));

    setPreviewData(normalized);
    setShowPromptModal(false);
    setShowPreviewModal(true);
  };

  const handleBulkConfirm = async (transactions) => {
    await createBulkTransactions(transactions);
    setShowPreviewModal(false);
  };

  ////////////////////////////////////////////////////
  // RECEIPT UPLOAD WITH LOADING
  ////////////////////////////////////////////////////

  const handleReceiptUpload = async (file) => {

    if (!file) return;

    try {

      setUploading(true); // 🔥 start loading

      const extracted = await uploadTransactionReceiptAI(file);
      if (!extracted) return;

      if (extracted.date) {
        extracted.date = new Date(extracted.date)
          .toISOString()
          .split("T")[0];
      }

      extracted.type = extracted.type || type;

      setModalData(extracted);
      setShowManualModal(true);

    } catch (error) {
      console.error("Receipt upload failed", error);
      alert("Failed to process receipt");
    } finally {
      setUploading(false); // 🔥 stop loading
    }
  };

  return (
    <div className="transaction-container">

      <h1>Transactions</h1>

      <div className="type-toggle">
        <button
          className={type === "expense" ? "active" : ""}
          onClick={() => setType("expense")}
        >
          Expense
        </button>

        <button
          className={type === "income" ? "active" : ""}
          onClick={() => setType("income")}
        >
          Income
        </button>
      </div>

      <div className="buttons">

        <button onClick={openManualModal}>
          Add Manual
        </button>

        <button onClick={() => setShowPromptModal(true)}>
          AI Prompt
        </button>

        {/* 🔥 Upload button with loading */}
        <label className={`upload-btn ${uploading ? "disabled" : ""}`}>
          {uploading ? "Processing Receipt..." : "Upload Receipt"}

          <input
            type="file"
            hidden
            disabled={uploading}
            onChange={(e) => handleReceiptUpload(e.target.files[0])}
          />
        </label>

      </div>

      {/* 🔥 Optional Loading Message */}
      {uploading && (
        <p className="upload-loading">
          AI is reading your receipt... Please wait
        </p>
      )}

      <TransactionList type={type} />

      {showManualModal &&
        <TransactionModal
          data={modalData}
          close={() => setShowManualModal(false)}
          onSave={saveTransaction}
        />
      }

      {showPromptModal &&
        <PromptModal
          close={() => setShowPromptModal(false)}
          onSubmit={handlePromptSubmit}
        />
      }

      {showPreviewModal && (
        <PreviewTransactionsModal
          data={previewData}
          close={() => setShowPreviewModal(false)}
          onConfirm={handleBulkConfirm}
        />
      )}

    </div>
  );
}

export default AddTransaction;