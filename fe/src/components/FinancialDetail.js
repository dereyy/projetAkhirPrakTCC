import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./FinancialDetail.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const FinancialDetail = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [timeFilter, setTimeFilter] = useState("day"); // 'day', 'month', 'year'
  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, timeFilter, selectedDate]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/transactions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const filterTransactions = () => {
    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const selected = new Date(selectedDate);

      switch (timeFilter) {
        case "day":
          return (
            transactionDate.getDate() === selected.getDate() &&
            transactionDate.getMonth() === selected.getMonth() &&
            transactionDate.getFullYear() === selected.getFullYear()
          );
        case "month":
          return (
            transactionDate.getMonth() === selected.getMonth() &&
            transactionDate.getFullYear() === selected.getFullYear()
          );
        case "year":
          return transactionDate.getFullYear() === selected.getFullYear();
        default:
          return true;
      }
    });

    setFilteredTransactions(filtered);
    calculateSummary(filtered);
  };

  const calculateSummary = (transactions) => {
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

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    if (timeFilter === "month") {
      // Set tanggal ke tanggal 1 saat memilih bulan
      newDate.setDate(1);
    } else if (timeFilter === "year") {
      // Set tanggal ke 1 Januari saat memilih tahun
      newDate.setMonth(0);
      newDate.setDate(1);
    }
    setSelectedDate(newDate);
  };

  const handleTimeFilterChange = (filter) => {
    setTimeFilter(filter);
    const newDate = new Date(selectedDate);

    if (filter === "month") {
      // Reset tanggal ke tanggal 1 saat beralih ke filter bulanan
      newDate.setDate(1);
    } else if (filter === "year") {
      // Reset tanggal ke 1 Januari saat beralih ke filter tahunan
      newDate.setMonth(0);
      newDate.setDate(1);
    }
    setSelectedDate(newDate);
  };

  const formatDate = (date) => {
    switch (timeFilter) {
      case "year":
        return `Tahun ${date.getFullYear()}`;
      case "month":
        return date.toLocaleDateString("id-ID", {
          month: "long",
          year: "numeric",
        });
      default:
        return date.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
    }
  };

  const getDateInputType = () => {
    switch (timeFilter) {
      case "year":
        return "number";
      case "month":
        return "month";
      default:
        return "date";
    }
  };

  const getDateInputValue = () => {
    switch (timeFilter) {
      case "year":
        return selectedDate.getFullYear();
      case "month":
        return `${selectedDate.getFullYear()}-${String(
          selectedDate.getMonth() + 1
        ).padStart(2, "0")}`;
      default:
        return selectedDate.toISOString().split("T")[0];
    }
  };

  return (
    <div className="financial-detail-page">
      <div className="container">
        <div className="detail-header">
          <h1>Detail Keuangan</h1>
          <button className="btn-back" onClick={() => navigate("/dashboard")}>
            Kembali ke Dashboard
          </button>
        </div>

        <div className="filter-section">
          <div className="time-filter">
            <button
              className={`filter-btn ${timeFilter === "day" ? "active" : ""}`}
              onClick={() => handleTimeFilterChange("day")}
            >
              Harian
            </button>
            <button
              className={`filter-btn ${timeFilter === "month" ? "active" : ""}`}
              onClick={() => handleTimeFilterChange("month")}
            >
              Bulanan
            </button>
            <button
              className={`filter-btn ${timeFilter === "year" ? "active" : ""}`}
              onClick={() => handleTimeFilterChange("year")}
            >
              Tahunan
            </button>
          </div>
          <div className="date-picker">
            <input
              type={getDateInputType()}
              value={getDateInputValue()}
              onChange={handleDateChange}
              min={timeFilter === "year" ? "2000" : undefined}
              max={timeFilter === "year" ? "2100" : undefined}
            />
          </div>
        </div>

        <div className="financial-summary">
          <div className="summary-card total-balance">
            <h3>Total Saldo</h3>
            <p className="amount">
              Rp {summary.totalBalance.toLocaleString("id-ID")}
            </p>
            <p className="period">{formatDate(selectedDate)}</p>
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
        </div>

        <div className="transactions-section">
          <h2>Daftar Transaksi</h2>
          {filteredTransactions.length === 0 ? (
            <div className="no-transactions">
              Tidak ada transaksi pada periode ini
            </div>
          ) : (
            <div className="transactions-list">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-info">
                    <span className={`transaction-type ${transaction.type}`}>
                      {transaction.type === "income"
                        ? "Pemasukan"
                        : "Pengeluaran"}
                    </span>
                    <div className="transaction-details">
                      <h4>{transaction.categoryName || "Tanpa Kategori"}</h4>
                      <p>{transaction.description || "-"}</p>
                      <span className="transaction-date">
                        {new Date(transaction.date).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  </div>
                  <div className="transaction-amount">
                    Rp {Number(transaction.amount).toLocaleString("id-ID")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialDetail;
