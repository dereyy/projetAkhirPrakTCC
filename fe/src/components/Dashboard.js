import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/transactions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setTransactions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      fetchTransactions();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        <button id="btnLogout" onClick={handleLogout}>Logout</button>
        <h1>Daftar Transaksi</h1>
        
        <div className="transaction-grid">
          {transactions.length === 0 ? (
            <div id="no-data-message">
              Anda belum mempunyai riwayat manajemen keuangan, silahkan input terlebih dahulu.
            </div>
          ) : (
            transactions.map(transaction => (
              <div key={transaction.id} className="transaction-card">
                <span className={`transaction-type ${transaction.jenis === 'pemasukan' ? 'income' : 'expense'}`}>
                  {transaction.jenis}
                </span>
                <strong>Rp {transaction.nominal}</strong>
                <div>Kategori: {transaction.kategori}</div>
                <div>Tanggal: {new Date(transaction.tanggal).toLocaleDateString()}</div>
                <div>Catatan: {transaction.catatan}</div>
                <button className="btn-edit" onClick={() => navigate(`/edit/${transaction.id}`)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(transaction.id)}>Hapus</button>
              </div>
            ))
          )}
        </div>

        <button className="btn-add" onClick={() => navigate('/add')}>
          + Tambah Transaksi
        </button>
      </div>
    </div>
  );
};

export default Dashboard; 