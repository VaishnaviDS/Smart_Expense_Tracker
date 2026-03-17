import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { GlobalContext } from "./UserContext";
import { DashboardContext } from "./DashboardContext";
import { server } from "../main";
import { toast } from "react-toastify";

export const TransactionContext = createContext(null);

function TransactionState({ children }) {

  const { token } = useContext(GlobalContext);
  const { refreshDashboard } = useContext(DashboardContext);

  const API = `${server}/api/transaction`;

  const [transactions, setTransactions] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);

  ////////////////////////////////////////////////////
  // AUTH HEADER
  ////////////////////////////////////////////////////

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` }
  };

  ////////////////////////////////////////////////////
  // GET TRANSACTIONS
  ////////////////////////////////////////////////////

  const getTransactions = async (filters = {}) => {
    try {

      setLoading(true);

      const res = await axios.get(API, {
        ...authHeader,
        params: filters
      });

      setTransactions(res.data.transactions);

    } catch (error) {
      toast.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  ////////////////////////////////////////////////////
  // CREATE MANUAL
  ////////////////////////////////////////////////////

  const createManualTransaction = async (data) => {
    try {

      const res = await axios.post(
        `${API}/manual`,
        data,
        authHeader
      );

      setTransactions(prev => [
        res.data.transaction,
        ...prev
      ]);

      refreshDashboard();

      toast.success("Transaction added successfully");

      return res.data.transaction;

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add transaction");
    }
  };

  ////////////////////////////////////////////////////
  // AI TEXT
  ////////////////////////////////////////////////////

  const createTransactionFromTextAI = async (prompt) => {
    try {

      const res = await axios.post(
        `${API}/ai-text`,
        { prompt },
        authHeader
      );

      refreshDashboard();

      toast.success("AI transaction created");

      return res.data.transactions;

    } catch (error) {

      if (error.response?.data?.fallback) {
        toast.warning("AI quota reached. Enter manually.");
        return;
      }

      toast.error(error.response?.data?.message || "AI failed");
    }
  };

  ////////////////////////////////////////////////////
  // AI RECEIPT
  ////////////////////////////////////////////////////

  const uploadTransactionReceiptAI = async (file) => {

    try {

      const formData = new FormData();
      formData.append("receipt", file);

      const res = await axios.post(
        `${API}/receipt`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (res.data.fallback) {
        toast.warning("AI quota reached. Enter manually.");
        return;
      }

      refreshDashboard();

      toast.success("Receipt processed successfully");

      return res.data.extracted;

    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    }
  };

  ////////////////////////////////////////////////////
  // EDIT
  ////////////////////////////////////////////////////

  const editTransaction = async (id, data) => {

    try {

      const res = await axios.put(
        `${API}/${id}`,
        data,
        authHeader
      );

      setTransactions(prev =>
        prev.map(t =>
          t._id === id ? res.data.transaction : t
        )
      );

      refreshDashboard();

      toast.success("Transaction updated");

    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  ////////////////////////////////////////////////////
  // DELETE
  ////////////////////////////////////////////////////

  const deleteTransaction = async (id) => {

    try {

      await axios.delete(`${API}/${id}`, authHeader);

      setTransactions(prev =>
        prev.filter(t => t._id !== id)
      );

      refreshDashboard();

      toast.success("Transaction deleted");

    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  ////////////////////////////////////////////////////
  // DASHBOARD
  ////////////////////////////////////////////////////

  const getDashboardData = async (year) => {

    try {

      const res = await axios.get(
        `${API}/dashboard`,
        {
          ...authHeader,
          params: { year }
        }
      );

      setDashboard(res.data);

    } catch (error) {
      toast.error("Failed to load dashboard");
    }
  };

  ////////////////////////////////////////////////////
  // BULK CREATE
  ////////////////////////////////////////////////////

  const createBulkTransactions = async (data) => {

    try {

      const res = await axios.post(
        `${API}/bulk`,
        { transactions: data },
        authHeader
      );

      setTransactions(prev => [
        ...res.data.transactions,
        ...prev
      ]);

      refreshDashboard();

      toast.success("Bulk transactions added");

      return res.data.transactions;

    } catch (error) {
      toast.error(error.response?.data?.message || "Bulk upload failed");
    }
  };

  ////////////////////////////////////////////////////
  // AUTO LOAD
  ////////////////////////////////////////////////////

  useEffect(() => {

    if (token) {
      getTransactions();
      getDashboardData();
    }

  }, [token]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        dashboard,
        loading,
        getTransactions,
        createManualTransaction,
        createTransactionFromTextAI,
        uploadTransactionReceiptAI,
        editTransaction,
        deleteTransaction,
        getDashboardData,
        createBulkTransactions
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export default TransactionState;