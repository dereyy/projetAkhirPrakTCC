import db from "../config/database.js";

export const Category = {
  create: async (categoryData) => {
    const { name } = categoryData;
    const query = "INSERT INTO categories (name) VALUES (?)";
    return db.query(query, [name]);
  },

  getAll: async () => {
    const query = "SELECT * FROM categories ORDER BY name ASC";
    return db.query(query);
  },

  getByNama: async (name) => {
    const query = "SELECT * FROM categories WHERE name = ?";
    return db.query(query, [name]);
  },

  getByJenis: async (jenis) => {
    const query = "SELECT * FROM categories WHERE jenis = ? ORDER BY name ASC";
    return db.query(query, [jenis]);
  },

  update: async (id, categoryData) => {
    const { name } = categoryData;
    const query = "UPDATE categories SET name = ? WHERE id = ?";
    return db.query(query, [name, id]);
  },

  delete: async (id) => {
    const query = "DELETE FROM categories WHERE id = ?";
    return db.query(query, [id]);
  },
};
