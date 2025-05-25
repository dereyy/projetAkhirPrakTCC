import db from "../config/database.js";

export const User = {
  create: async (userData) => {
    try {
      const { name, email, gender, password } = userData;
      console.log("Creating user with data:", { name, email, gender });

      const query =
        "INSERT INTO users (name, email, gender, password) VALUES (?, ?, ?, ?)";
      const [result] = await db.query(query, [name, email, gender, password]);
      console.log("User creation result:", result);
      return result;
    } catch (error) {
      console.error("Error in User.create:", error);
      throw error;
    }
  },

  findByEmail: async (email) => {
    try {
      console.log("Finding user by email:", email);
      const query = "SELECT * FROM users WHERE email = ?";
      const [rows] = await db.query(query, [email]);
      console.log("Find by email result:", rows);
      return rows;
    } catch (error) {
      console.error("Error in User.findByEmail:", error);
      throw error;
    }
  },

  findById: async (id) => {
    try {
      console.log("Finding user by id:", id);
      const query = "SELECT id, name, email, gender FROM users WHERE id = ?";
      const [rows] = await db.query(query, [id]);
      console.log("Find by id result:", rows);
      return rows;
    } catch (error) {
      console.error("Error in User.findById:", error);
      throw error;
    }
  },
};
