import db from "../config/database.js";

export const Transaction = {
  create: async (transactionData) => {
    const { user_id, nominal, kategori, tanggal, catatan } = transactionData;
    const query = "INSERT INTO transactions (user_id, nominal, kategori, tanggal, catatan) VALUES (?, ?, ?, ?, ?)";
    return db.query(query, [user_id, nominal, kategori, tanggal, catatan]);
  },

  getByUserId: async (userId) => {
    const query = "SELECT * FROM transactions WHERE user_id = ? ORDER BY tanggal DESC";
    return db.query(query, [userId]);
  },

  getByDateRange: async (userId, startDate, endDate) => {
    const query = "SELECT * FROM transactions WHERE user_id = ? AND tanggal BETWEEN ? AND ? ORDER BY tanggal DESC";
    return db.query(query, [userId, startDate, endDate]);
  },

  delete: async (id) => {
    const query = "DELETE FROM transactions WHERE id = ?";
    return db.query(query, [id]);
  }
}; 