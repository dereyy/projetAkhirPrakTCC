import db from "../config/database.js";

export const Category = {
  create: async (categoryData) => {
    try {
      const { name } = categoryData;
      console.log("Attempting to create category with name:", name);

      // Validasi input di level model
      if (!name || typeof name !== "string") {
        throw new Error("Invalid category name");
      }

      const query = "INSERT INTO categories (name) VALUES (?)";
      console.log("Executing query:", query, "with params:", [name]);

      const [result] = await db.query(query, [name]);
      console.log("Query result:", result);

      return result;
    } catch (error) {
      console.error("Error in Category.create:", {
        message: error.message,
        code: error.code,
        errno: error.errno,
        sqlMessage: error.sqlMessage,
        sqlState: error.sqlState,
      });
      throw error;
    }
  },

  getAll: async () => {
    const query = "SELECT * FROM categories ORDER BY name ASC";
    return db.query(query);
  },

  getByNama: async (name) => {
    try {
      console.log("Searching for category with name:", name);
      const query = "SELECT * FROM categories WHERE name = ?";
      const [rows] = await db.query(query, [name]);
      console.log("Found categories:", rows);
      return [rows];
    } catch (error) {
      console.error("Error in Category.getByNama:", error);
      throw error;
    }
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

  deleteByUserId: async (userId) => {
    try {
      console.log("Categories are global, no need to delete by userId");
      return [{ affectedRows: 0 }];
    } catch (error) {
      console.error("Error in Category.deleteByUserId:", error);
      throw error;
    }
  },
};
