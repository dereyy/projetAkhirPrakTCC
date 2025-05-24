import { Transaction } from "../model/Transaction.js";

export const TransactionController = {
  create: async (req, res) => {
    try {
      const { nominal, kategori, tanggal, catatan } = req.body;
      const user_id = req.user.userId;

      // Validasi data
      if (!nominal || nominal <= 0) {
        return res.status(400).json({ msg: "Nominal harus lebih dari 0" });
      }

      if (!kategori || !["pemasukan", "pengeluaran"].includes(kategori)) {
        return res
          .status(400)
          .json({ msg: "Kategori harus pemasukan atau pengeluaran" });
      }

      if (!tanggal) {
        return res.status(400).json({ msg: "Tanggal harus diisi" });
      }

      // Validasi format tanggal
      const dateObj = new Date(tanggal);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ msg: "Format tanggal tidak valid" });
      }

      const result = await Transaction.create({
        user_id,
        nominal: Number(nominal),
        kategori,
        tanggal,
        catatan: catatan || "",
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
      const user_id = req.user.userId;
      const [transactions] = await Transaction.getByUserId(user_id);

      // Format data sebelum dikirim ke client
      const formattedTransactions = transactions.map((transaction) => ({
        ...transaction,
        nominal: Number(transaction.nominal),
        tanggal: transaction.tanggal.toISOString().split("T")[0],
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
      const user_id = req.user.userId;

      if (!startDate || !endDate) {
        return res
          .status(400)
          .json({ msg: "Tanggal awal dan akhir harus diisi" });
      }

      const [transactions] = await Transaction.getByDateRange(
        user_id,
        startDate,
        endDate
      );

      // Format data sebelum dikirim ke client
      const formattedTransactions = transactions.map((transaction) => ({
        ...transaction,
        nominal: Number(transaction.nominal),
        tanggal: transaction.tanggal.toISOString().split("T")[0],
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
      const { nominal, kategori, tanggal, catatan } = req.body;
      const user_id = req.user.userId;

      await Transaction.update(id, user_id, {
        nominal,
        kategori,
        tanggal,
        catatan,
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
      console.error("Error deleting transaction:", error);
      res.status(500).json({ msg: error.message });
    }
  },
};
