import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Categories.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", type: "expense" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/categories", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setCategories(response.data);
    } catch (error) {
      setError("Gagal memuat kategori");
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.post("http://localhost:5001/api/categories", newCategory, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setSuccess("Kategori berhasil ditambahkan");
      setNewCategory({ name: "", type: "expense" });
      setShowAddForm(false);
      fetchCategories();
    } catch (error) {
      setError("Gagal menambahkan kategori");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
      try {
        await axios.delete(`http://localhost:5001/api/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setSuccess("Kategori berhasil dihapus");
        fetchCategories();
      } catch (error) {
        setError("Gagal menghapus kategori");
      }
    }
  };

  return (
    <div className="categories-page">
      <div className="container">
        <div className="categories-header">
          <h1>Kategori</h1>
          <button className="btn-back" onClick={() => navigate(-1)}>
            Kembali
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        {showAddForm ? (
          <div className="add-category-form">
            <h2>Tambah Kategori Baru</h2>
            <form onSubmit={handleAddCategory}>
              <div className="form-group">
                <label htmlFor="name">Nama Kategori</label>
                <input
                  type="text"
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="type">Tipe</label>
                <select
                  id="type"
                  value={newCategory.type}
                  onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
                  required
                >
                  <option value="expense">Pengeluaran</option>
                  <option value="income">Pemasukan</option>
                </select>
              </div>
              <div className="button-group">
                <button type="submit" className="btn-save">
                  Simpan
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowAddForm(false)}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="categories-grid">
              {categories.length === 0 ? (
                <div className="no-data-message">
                  Belum ada kategori. Silakan tambahkan kategori baru.
                </div>
              ) : (
                categories.map((category) => (
                  <div key={category.id} className="category-card">
                    <span className={`category-type ${category.type}`}>
                      {category.type === "income" ? "Pemasukan" : "Pengeluaran"}
                    </span>
                    <h3>{category.name}</h3>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      Hapus
                    </button>
                  </div>
                ))
              )}
            </div>
            <button className="btn-add" onClick={() => setShowAddForm(true)}>
              + Tambah Kategori
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Categories; 