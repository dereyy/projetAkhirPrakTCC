import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import config from "../config";
import "./EditTransaction.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const EditTransaction = () => {
  const { id } = useParams(); // Mengambil ID transaksi dari URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    date: "", // Tanggal akan diisi dari data yang diambil
    categoryId: "",
    type: "",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [transactionLoaded, setTransactionLoaded] = useState(false); // State baru
  const [formKey, setFormKey] = useState(0); // State baru untuk memaksa re-render form

  // Effect untuk fetch data transaksi spesifik
  useEffect(() => {
    console.log("Fetching transaction data for ID:", id);
    fetchTransactionData();
    fetchCategories();
  }, [id]); // Fetch data saat ID berubah atau komponen pertama kali dimuat

  // Effect untuk memantau perubahan formData (untuk debugging)
  useEffect(() => {
    console.log("formData updated:", formData);
  }, [formData]);

  const fetchTransactionData = async () => {
    setLoading(true); // Set loading true saat fetch dimulai
    setError(""); // Reset error
    setTransactionLoaded(false); // Reset loaded state
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }
      const response = await axios.get(`${API_URL}/api/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Raw response data:", response.data);
      console.log("Is response.data an array?", Array.isArray(response.data));

      // Ambil data transaksi dari response, handle kasus array
      const transaction = Array.isArray(response.data)
        ? response.data[0]
        : response.data;

      console.log("Processed transaction data:", transaction);
      console.log(
        "Type of transaction.amount:",
        typeof transaction.amount,
        "Value:",
        transaction.amount
      );
      console.log(
        "Type of transaction.date:",
        typeof transaction.date,
        "Value:",
        transaction.date
      );
      console.log(
        "Type of transaction.categoryId:",
        typeof transaction.categoryId,
        "Value:",
        transaction.categoryId
      );
      console.log(
        "Type of transaction.type:",
        typeof transaction.type,
        "Value:",
        transaction.type
      );
      console.log(
        "Type of transaction.id:",
        typeof transaction.id,
        "Value:",
        transaction.id
      );
      console.log(
        "Type of transaction.description:",
        typeof transaction.description,
        "Value:",
        transaction.description
      );
      console.log(
        "Type of transaction.categoryName:",
        typeof transaction.categoryName,
        "Value:",
        transaction.categoryName
      );

      // --- Validasi Struktur Data --- //
      if (
        !transaction ||
        typeof transaction !== "object" ||
        !transaction.id ||
        typeof transaction.amount === "undefined" ||
        typeof transaction.date === "undefined" ||
        typeof transaction.categoryId === "undefined" ||
        typeof transaction.type === "undefined"
      ) {
        console.error(
          "Invalid transaction data structure received:",
          transaction
        );
        setError("Gagal memuat data transaksi: Struktur data tidak valid.");
        setLoading(false);
        return; // Hentikan proses jika data tidak valid
      }
      // ----------------------------- //

      // Format tanggal agar sesuai dengan input type="date"
      // Pastikan transaction.date adalah string atau Date object yang valid
      let formattedDate = "";
      if (transaction.date) {
        try {
          // Coba buat Date object lalu format
          const dateObj = new Date(transaction.date);
          if (!isNaN(dateObj.getTime())) {
            formattedDate = dateObj.toISOString().split("T")[0];
          } else if (
            typeof transaction.date === "string" &&
            transaction.date.includes("T")
          ) {
            // Jika gagal, coba langsung split string jika formatnya ISO
            formattedDate = transaction.date.split("T")[0];
          } else if (typeof transaction.date === "string") {
            // Jika hanya tanggal YYYY-MM-DD
            formattedDate = transaction.date;
          } else {
            console.warn("Unexpected date format:", transaction.date);
          }
        } catch (e) {
          console.error("Error processing date format:", transaction.date, e);
        }
      }
      console.log("Formatted date for form:", formattedDate);

      const newFormData = {
        amount:
          transaction.amount !== undefined && transaction.amount !== null
            ? transaction.amount
            : "",
        description: transaction.description || "",
        date: formattedDate,
        categoryId:
          transaction.categoryId !== undefined &&
          transaction.categoryId !== null
            ? transaction.categoryId
            : "",
        type: transaction.type || "",
      };

      console.log("Attempting to set formData with:", newFormData); // <<< Log ini
      setFormData(newFormData); // <<< Panggil setFormData
      console.log("setFormData called with:", newFormData); // <<< Log nilai yang disetel

      setTransactionLoaded(true); // Data berhasil dimuat
      setFormKey((prevKey) => prevKey + 1); // Perbarui key form untuk memaksa re-render
    } catch (err) {
      console.error("Error fetching transaction data:", err);
      // Menangani error response dari backend
      if (err.response) {
        console.error("Error response data:", err.response.data);
        setError(err.response?.data?.msg || "Gagal memuat data transaksi.");
      } else if (err.request) {
        console.error("Error request:", err.request);
        setError(
          "Gagal memuat data transaksi: Tidak dapat terhubung ke server."
        );
      } else {
        console.error("Error message:", err.message);
        setError(`Gagal memuat data transaksi: ${err.message}`);
      }
    } finally {
      setLoading(false); // Loading selesai
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return; // Jangan fetch jika tidak ada token
      const response = await axios.get(`${API_URL}/api/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Categories response in EditTransaction:", response.data);
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      } else {
        console.warn("Format data kategori tidak valid:", response.data);
        //setError("Gagal memuat kategori: Struktur data tidak valid."); // Opsional: tampilkan error kategori
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      // Menangani error response
      if (err.response) {
        console.error("Error response data (categories):", err.response.data);
        //setError(err.response?.data?.msg || "Gagal memuat kategori."); // Opsional
      } else if (err.request) {
        console.error("Error request (categories):", err.request);
        //setError("Gagal memuat kategori: Tidak dapat terhubung ke server."); // Opsional
      } else {
        console.error("Error message (categories):", err.message);
        //setError(`Gagal memuat kategori: ${err.message}`); // Opsional
      }
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
    setError(""); // Reset error sebelum submit
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      // Konversi amount ke number
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      await axios.put(`${API_URL}/api/transactions/${id}`, transactionData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Transaction updated successfully:", transactionData);
      navigate("/dashboard"); // Kembali ke dashboard setelah update
    } catch (err) {
      console.error("Error updating transaction:", err);
      if (err.response) {
        console.error("Error response:", err.response.data);
        setError(
          err.response?.data?.msg ||
            "Terjadi kesalahan saat mengupdate transaksi"
        );
      } else if (err.request) {
        console.error("Request error:", err.request);
        setError("Tidak dapat terhubung ke server untuk mengupdate transaksi.");
      } else {
        setError(`Terjadi kesalahan saat mengupdate transaksi: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Tampilkan loading message jika sedang memuat ATAU data transaksi spesifik belum dimuat
  if (loading || !transactionLoaded) {
    return <div className="loading-message">Memuat data transaksi...</div>;
  }

  // Tampilkan error jika data spesifik gagal dimuat dan tidak ada data di form
  if (error && !formData.date && !formData.amount) {
    return <div className="error-message">{error}</div>;
  }

  console.log("Rendering form with formData:", formData);
  console.log(
    "Input values check: amount=",
    formData.amount,
    ", date=",
    formData.date,
    ", categoryId=",
    formData.categoryId,
    ", type=",
    formData.type
  );

  return (
    <div className="edit-transaction-container" key={id}>
      {" "}
      {/* Added key={id} */}
      <h2>Edit Transaksi</h2>
      {/* Tampilkan error saat submit jika form sudah terisi */}
      {error && (formData.date || formData.amount) && (
        <div className="error-message">{error}</div>
      )}
      {/* Render form hanya jika data transaksi spesifik sudah dimuat */}
      {transactionLoaded && (
        <form
          onSubmit={handleSubmit}
          className="transaction-form"
          key={formKey}
        >
          {" "}
          {/* Added key={formKey} */}
          <div className="form-group">
            <label htmlFor="type">Jenis Transaksi</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="income">Pemasukan</option>
              <option value="expense">Pengeluaran</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="amount">Nominal (Rp)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount} // Periksa nilai amount
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="Masukkan nominal"
            />
          </div>
          <div className="form-group">
            <label htmlFor="categoryId">Kategori</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId} // Periksa nilai categoryId
              onChange={handleChange}
              required
            >
              <option value="">Pilih Kategori</option>
              {Array.isArray(categories) &&
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="date">Tanggal</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date} // Periksa nilai date
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Deskripsi</label>
            <textarea
              id="description"
              name="description"
              value={formData.description} // Periksa nilai description
              onChange={handleChange}
              placeholder="Tambahkan deskripsi transaksi (opsional)"
              rows="3"
            />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Mengupdate..." : "Update Transaksi"}
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/dashboard")}
          >
            Batal
          </button>
        </form>
      )}
    </div>
  );
};

export default EditTransaction;
