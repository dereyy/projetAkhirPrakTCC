import db from "../config/database.js";

export const Category = {
  create: async (categoryData) => {
    const { nama_kategori, jenis, deskripsi } = categoryData;
    const query =
      "INSERT INTO categories (nama_kategori, jenis, deskripsi) VALUES (?, ?, ?)";
    return db.query(query, [nama_kategori, jenis, deskripsi]);
  },

  getAll: async () => {
    const query = "SELECT * FROM categories ORDER BY nama_kategori ASC";
    return db.query(query);
  },

  getByNama: async (nama_kategori) => {
    const query = "SELECT * FROM categories WHERE nama_kategori = ?";
    return db.query(query, [nama_kategori]);
  },

  getByJenis: async (jenis) => {
    const query =
      "SELECT * FROM categories WHERE jenis = ? ORDER BY nama_kategori ASC";
    return db.query(query, [jenis]);
  },

  update: async (id, categoryData) => {
    const { nama_kategori, jenis, deskripsi } = categoryData;
    const query =
      "UPDATE categories SET nama_kategori = ?, jenis = ?, deskripsi = ? WHERE id = ?";
    return db.query(query, [nama_kategori, jenis, deskripsi, id]);
  },

  delete: async (id) => {
    const query = "DELETE FROM categories WHERE id = ?";
    return db.query(query, [id]);
  },
};
