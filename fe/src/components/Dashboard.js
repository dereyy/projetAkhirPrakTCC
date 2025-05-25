import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddTransaction from "./AddTransaction";
import Navbar from "./Navbar";
import "./Dashboard.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  useEffect(() => {
    calculateSummary();
  }, [transactions]);

  const calculateSummary = () => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    setSummary({
      totalBalance: totalIncome - totalExpense,
      totalIncome,
      totalExpense,
    });
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/transactions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      console.log("Transactions response:", response.data);
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      console.log("Categories response in Dashboard:", response.data);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      try {
        await axios.delete(`${API_URL}/api/transactions/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        console.log("Transaction deleted successfully:", id);
        fetchTransactions();
      } catch (error) {
        console.error("Error deleting transaction:", error);
        if (error.response) {
          console.error("Error response:", error.response.data);
          alert(
            `Gagal menghapus transaksi: ${
              error.response.data.msg || error.message
            }`
          );
        } else if (error.request) {
          console.error("Request error:", error.request);
          alert("Gagal menghapus transaksi: Tidak dapat terhubung ke server.");
        } else {
          alert(`Gagal menghapus transaksi: ${error.message}`);
        }
      }
    }
  };

  const handleTransactionAdded = () => {
    fetchTransactions();
    setShowAddForm(false);
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="container">
        <div className="financial-summary">
          <div className="summary-card total-balance">
            <h3>Total Saldo</h3>
            <p className="amount">
              Rp {summary.totalBalance.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="summary-row">
            <div className="summary-card income">
              <h3>Total Pemasukan</h3>
              <p className="amount">
                Rp {summary.totalIncome.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="summary-card expense">
              <h3>Total Pengeluaran</h3>
              <p className="amount">
                Rp {summary.totalExpense.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
          <button className="btn-detail" onClick={() => navigate("/detail")}>
            Lihat Detail
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showAddForm ? (
          <AddTransaction onTransactionAdded={handleTransactionAdded} />
        ) : (
          <>
            <div className="transaction-grid">
              {transactions.length === 0 ? (
                <div id="no-data-message">
                  Anda belum mempunyai riwayat manajemen keuangan, silahkan
                  input terlebih dahulu.
                </div>
              ) : (
                transactions.map((transaction) => (
                  <div key={transaction.id} className="transaction-card">
                    <span
                      className={`transaction-type ${
                        transaction.type === "income" ? "income" : "expense"
                      }`}
                    >
                      {transaction.type === "income"
                        ? "Pemasukan"
                        : "Pengeluaran"}{" "}
                      - {transaction.categoryName || "Tanpa Kategori"}
                    </span>
                    <strong>
                      Rp{" "}
                      {transaction.amount !== undefined &&
                      transaction.amount !== null
                        ? Number(transaction.amount).toLocaleString("id-ID")
                        : "0"}
                    </strong>
                    <div>
                      Tanggal:{" "}
                      {transaction.date
                        ? new Date(transaction.date).toLocaleDateString("id-ID")
                        : "-"}
                    </div>
                    <div>Deskripsi: {transaction.description || "-"}</div>
                    <div className="transaction-actions">
                      <button
                        className="btn-edit"
                        onClick={() => navigate(`/edit/${transaction.id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(transaction.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button className="btn-add" onClick={() => setShowAddForm(true)}>
              + Tambah Transaksi
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
