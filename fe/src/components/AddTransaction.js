import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import "./Transaction.css";

const AddTransaction = ({ onTransactionAdded }) => {
  const [formData, setFormData] = useState({
    nominal: "",
    kategori: "",
    tanggal: new Date().toISOString().split("T")[0],
    catatan: "",
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${config.API_URL}/api/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Gagal memuat kategori");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await axios.post(
        `${config.API_URL}/api/transactions`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Transaction added:", response.data);

      // Reset form
      setFormData({
        nominal: "",
        kategori: "",
        tanggal: new Date().toISOString().split("T")[0],
        catatan: "",
      });

      // Notify parent component
      if (onTransactionAdded) {
        onTransactionAdded();
      }
    } catch (err) {
      console.error("Error adding transaction:", err);
      setError(
        err.response?.data?.msg || "Terjadi kesalahan saat menambah transaksi"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-transaction-container">
      <h2>Tambah Transaksi Baru</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-group">
          <label htmlFor="nominal">Nominal (Rp)</label>
          <input
            type="number"
            id="nominal"
            name="nominal"
            value={formData.nominal}
            onChange={handleChange}
            required
            min="0"
            placeholder="Masukkan nominal"
          />
        </div>

        <div className="form-group">
          <label htmlFor="kategori">Kategori</label>
          <select
            id="kategori"
            name="kategori"
            value={formData.kategori}
            onChange={handleChange}
            required
          >
            <option value="">Pilih Kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.nama_kategori}>
                {category.nama_kategori}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tanggal">Tanggal</label>
          <input
            type="date"
            id="tanggal"
            name="tanggal"
            value={formData.tanggal}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="catatan">Catatan</label>
          <textarea
            id="catatan"
            name="catatan"
            value={formData.catatan}
            onChange={handleChange}
            placeholder="Tambahkan catatan (opsional)"
            rows="3"
          />
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? "Menambahkan..." : "Tambah Transaksi"}
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;
