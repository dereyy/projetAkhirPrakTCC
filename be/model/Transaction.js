import db from "../config/database.js";

export const Transaction = {
  create: async (transactionData) => {
    const { userId, amount, categoryId, date, description, type } =
      transactionData;
    
    console.log("Model received data:", transactionData);
    
    const query = `
      INSERT INTO transactions 
      (user_id, amount, category_id, date, description, type, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    
    console.log("Executing query:", query);
    console.log("With parameters:", [userId, amount, categoryId, date, description, type]);
    
    try {
      const result = await db.query(query, [userId, amount, categoryId, date, description, type]);
      console.log("Query result:", result);
      return result;
    } catch (error) {
      console.error("Database error:", error);
      console.error("Error stack:", error.stack);
      console.error("SQL query:", error.sql);
      console.error("SQL message:", error.sqlMessage);
      throw error;
    }
  },

  getById: async (id, userId) => {
    const query = `
      SELECT 
        t.id,
        t.amount,
        t.description,
        t.date,
        t.type,
        t.created_at,
        t.category_id as categoryId,
        t.user_id as userId,
        c.name as categoryName 
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = ? AND t.user_id = ?
    `;
    return db.query(query, [id, userId]);
  },

  getByUserId: async (userId) => {
    const query = `
      SELECT 
        t.id,
        t.amount,
        t.description,
        t.date,
        t.type,
        t.created_at,
        t.category_id as categoryId,
        t.user_id as userId,
        c.name as categoryName 
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ? 
      ORDER BY t.date DESC
    `;
    return db.query(query, [userId]);
  },

  getByDateRange: async (userId, startDate, endDate) => {
    const query = `
      SELECT 
        t.id,
        t.amount,
        t.description,
        t.date,
        t.type,
        t.created_at,
        t.category_id as categoryId,
        t.user_id as userId,
        c.name as categoryName 
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ? AND t.date BETWEEN ? AND ? 
      ORDER BY t.date DESC
    `;
    return db.query(query, [userId, startDate, endDate]);
  },

  update: async (id, userId, transactionData) => {
    const { amount, categoryId, date, description, type } = transactionData;
    const query = `
      UPDATE transactions 
      SET amount = ?, category_id = ?, date = ?, description = ?, type = ?
      WHERE id = ? AND user_id = ?
    `;
    return db.query(query, [amount, categoryId, date, description, type, id, userId]);
  },

  delete: async (id, userId) => {
    const query = "DELETE FROM transactions WHERE id = ? AND user_id = ?";
    return db.query(query, [id, userId]);
  },
};
