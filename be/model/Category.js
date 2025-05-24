import db from "../config/database.js";

export const Category = {
  create: async (categoryData) => {
    const { nama_kategori, jenis, deskripsi } = categoryData;
    const query = "INSERT INTO categories (nama_kategori, jenis, deskripsi) VALUES (?, ?, ?)";
    return db.query(query, [nama_kategori, jenis, deskripsi]);
  },

  getAll: async () => {
    const query = "SELECT * FROM categories";
    return db.query(query);
  },

  getByJenis: async (jenis) => {
    const query = "SELECT * FROM categories WHERE jenis = ?";
    return db.query(query, [jenis]);
  },

  delete: async (id) => {
    const query = "DELETE FROM categories WHERE id = ?";
    return db.query(query, [id]);
  }
}; 