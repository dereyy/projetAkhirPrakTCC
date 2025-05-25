import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Categories.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "" });
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
      console.error("Error fetching categories:", error);
      if (error.response) {
        setError(error.response.data.msg || "Gagal memuat kategori");
      } else {
        setError("Gagal memuat kategori: " + error.message);
      }
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validasi input
    if (!newCategory.name.trim()) {
      setError("Nama kategori tidak boleh kosong");
      return;
    }

    try {
      console.log("Sending category data:", newCategory);
      const response = await axios.post(
        "http://localhost:5001/api/categories",
        newCategory,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Server response:", response.data);
      setSuccess("Kategori berhasil ditambahkan");
      setNewCategory({ name: "" });
      setShowAddForm(false);
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
      if (error.response) {
        // Server responded with error
        const errorMsg = error.response.data.msg || "Gagal menambahkan kategori";
        const errorCode = error.response.data.error;
        
        switch (errorCode) {
          case "NAME_REQUIRED":
            setError("Nama kategori harus diisi");
            break;
          case "NAME_EMPTY":
            setError("Nama kategori tidak boleh kosong");
            break;
          case "CATEGORY_EXISTS":
            setError("Kategori dengan nama tersebut sudah ada");
            break;
          default:
            setError(errorMsg);
        }
      } else if (error.request) {
        // Request was made but no response
        setError("Tidak dapat terhubung ke server");
      } else {
        // Other errors
        setError("Gagal menambahkan kategori: " + error.message);
      }
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
        console.error("Error deleting category:", error);
        if (error.response) {
          setError(error.response.data.msg || "Gagal menghapus kategori");
        } else {
          setError("Gagal menghapus kategori: " + error.message);
        }
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
                  onChange={(e) => setNewCategory({ name: e.target.value })}
                  required
                  placeholder="Masukkan nama kategori"
                  minLength={1}
                  maxLength={255}
                />
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