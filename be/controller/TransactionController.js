import { Transaction } from "../model/Transaction.js";

export const TransactionController = {
  create: async (req, res) => {
    try {
      const { nominal, kategori, tanggal, catatan } = req.body;
      const user_id = req.user.userId;

      await Transaction.create({
        user_id,
        nominal,
        kategori,
        tanggal,
        catatan
      });

      res.status(201).json({ msg: "Transaksi berhasil ditambahkan" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const user_id = req.user.userId;
      const transactions = await Transaction.getByUserId(user_id);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  getByDateRange: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const user_id = req.user.userId;
      
      const transactions = await Transaction.getByDateRange(user_id, startDate, endDate);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { nominal, kategori, tanggal, catatan } = req.body;
      const user_id = req.user.userId;

      await Transaction.update(id, user_id, {
        nominal,
        kategori,
        tanggal,
        catatan
      });

      res.json({ msg: "Transaksi berhasil diupdate" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const user_id = req.user.userId;
      
      await Transaction.delete(id, user_id);
      res.json({ msg: "Transaksi berhasil dihapus" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }
}; 