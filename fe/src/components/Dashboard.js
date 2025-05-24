import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddTransaction from "./AddTransaction";
import "./Dashboard.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/transactions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      console.log("Transactions response:", response.data);
      // Assuming the response data is an array of transactions directly
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
      // Assuming the response data is an array of categories directly
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      fetchTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleTransactionAdded = () => {
    fetchTransactions();
    setShowAddForm(false);
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Dashboard Keuangan</h1>
          <button id="btnLogout" onClick={handleLogout}>
            Logout
          </button>
        </div>

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
