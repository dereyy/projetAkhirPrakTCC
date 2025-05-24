import db from "../config/database.js";

export const Transaction = {
  create: async (transactionData) => {
    const { userId, amount, categoryId, date, description, type } =
      transactionData;
    const query = `
      INSERT INTO transactions 
      (userId, amount, categoryId, date, description, type) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    return db.query(query, [
      userId,
      amount,
      categoryId,
      date,
      description,
      type,
    ]);
  },

  getByUserId: async (userId) => {
    const query = `
      SELECT t.*, c.name as categoryName 
      FROM transactions t
      LEFT JOIN categories c ON t.categoryId = c.id
      WHERE t.userId = ? 
      ORDER BY t.date DESC
    `;
    return db.query(query, [userId]);
  },

  getByDateRange: async (userId, startDate, endDate) => {
    const query = `
      SELECT t.*, c.name as categoryName 
      FROM transactions t
      LEFT JOIN categories c ON t.categoryId = c.id
      WHERE t.userId = ? AND t.date BETWEEN ? AND ? 
      ORDER BY t.date DESC
    `;
    return db.query(query, [userId, startDate, endDate]);
  },

  update: async (id, userId, transactionData) => {
    const { amount, categoryId, date, description, type } = transactionData;
    const query = `
      UPDATE transactions 
      SET amount = ?, categoryId = ?, date = ?, description = ?, type = ?
      WHERE id = ? AND userId = ?
    `;
    return db.query(query, [
      amount,
      categoryId,
      date,
      description,
      type,
      id,
      userId,
    ]);
  },

  delete: async (id, userId) => {
    const query = "DELETE FROM transactions WHERE id = ? AND userId = ?";
    return db.query(query, [id, userId]);
  },
};
