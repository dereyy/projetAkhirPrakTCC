import { Transaction } from "../model/Transaction.js";

export const TransactionController = {
  create: async (req, res) => {
    try {
      const { amount, categoryId, date, description, type } = req.body;
      const userId = req.user.userId;

      console.log("Received transaction data:", req.body);

      // Validasi data
      if (!amount || amount <= 0) {
        return res.status(400).json({ msg: "Nominal harus lebih dari 0" });
      }

      if (!categoryId) {
        return res.status(400).json({ msg: "Kategori harus dipilih" });
      }

      if (!date) {
        return res.status(400).json({ msg: "Tanggal harus diisi" });
      }

      if (!type || !["income", "expense"].includes(type)) {
        return res
          .status(400)
          .json({ msg: "Tipe transaksi harus income atau expense" });
      }

      // Validasi format tanggal
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ msg: "Format tanggal tidak valid" });
      }

      const result = await Transaction.create({
        userId,
        amount: Number(amount),
        categoryId,
        date,
        description: description || "",
        type,
      });

      console.log("Transaction created:", result);
      res.status(201).json({ msg: "Transaksi berhasil ditambahkan" });
    } catch (error) {
      console.error("Error creating transaction:", error);
      res.status(500).json({ msg: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const userId = req.user.userId;
      const [transactions] = await Transaction.getByUserId(userId);

      // Format data sebelum dikirim ke client
      const formattedTransactions = transactions.map((transaction) => ({
        ...transaction,
        amount: Number(transaction.amount),
        date: transaction.date.toISOString().split("T")[0],
      }));

      console.log("Sending transactions:", formattedTransactions);
      res.json(formattedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ msg: error.message });
    }
  },

  getByDateRange: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const userId = req.user.userId;

      if (!startDate || !endDate) {
        return res
          .status(400)
          .json({ msg: "Tanggal awal dan akhir harus diisi" });
      }

      const [transactions] = await Transaction.getByDateRange(
        userId,
        startDate,
        endDate
      );

      // Format data sebelum dikirim ke client
      const formattedTransactions = transactions.map((transaction) => ({
        ...transaction,
        amount: Number(transaction.amount),
        date: transaction.date.toISOString().split("T")[0],
      }));

      res.json(formattedTransactions);
    } catch (error) {
      console.error("Error fetching transactions by date range:", error);
      res.status(500).json({ msg: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { amount, categoryId, date, description, type } = req.body;
      const userId = req.user.userId;

      await Transaction.update(id, userId, {
        amount,
        categoryId,
        date,
        description,
        type,
      });

      res.json({ msg: "Transaksi berhasil diupdate" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      await Transaction.delete(id, userId);
      res.json({ msg: "Transaksi berhasil dihapus" });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      res.status(500).json({ msg: error.message });
    }
  },
};
