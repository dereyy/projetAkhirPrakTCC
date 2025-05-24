import { Transaction } from "../model/Transaction.js";

export const TransactionController = {
  create: async (req, res) => {
    try {
      const { amount, categoryId, date, description, type } = req.body;
      const userId = req.user.userId;

      console.log("Received transaction data for creation:", req.body);

      // Validasi data
      if (!amount || amount <= 0) {
        console.error("Validation error: Nominal must be greater than 0");
        return res.status(400).json({ msg: "Nominal harus lebih dari 0" });
      }

      if (!categoryId) {
        console.error("Validation error: Category ID is missing");
        return res.status(400).json({ msg: "Kategori harus dipilih" });
      }

      if (!date) {
        console.error("Validation error: Date is missing");
        return res.status(400).json({ msg: "Tanggal harus diisi" });
      }

      if (!type || !["income", "expense"].includes(type)) {
        console.error("Validation error: Invalid transaction type", type);
        return res
          .status(400)
          .json({ msg: "Tipe transaksi harus income atau expense" });
      }

      // Validasi format tanggal
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        console.error("Validation error: Invalid date format", date);
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

      console.log("Transaction created successfully:", result);
      res.status(201).json({ msg: "Transaksi berhasil ditambahkan" });
    } catch (error) {
      console.error("Error creating transaction:", error);
      res.status(500).json({ msg: error.message });
    }
  },

  getById: async (req, res) => {
    let id;
    let userId;
    try {
      ({ id } = req.params);
      userId = req.user.userId;
      console.log(
        `Attempting to fetch transaction with ID: ${id} for User ID: ${userId}`
      );

      const [transaction] = await Transaction.getById(id, userId);

      console.log("Raw transaction data from model:", transaction);

      if (!transaction) {
        console.warn(
          `Transaction with ID ${id} not found for User ID ${userId}`
        );
        return res.status(404).json({ msg: "Transaksi tidak ditemukan" });
      }

      // Explicitly construct the response object with correct formatting
      let formattedDate = null;
      if (transaction.date) {
        try {
          const dateObject = new Date(transaction.date);
          if (!isNaN(dateObject.getTime())) {
            formattedDate = dateObject.toISOString().split("T")[0];
          } else if (
            typeof transaction.date === "string" &&
            transaction.date.includes("T")
          ) {
            formattedDate = transaction.date.split("T")[0];
          } else if (typeof transaction.date === "string") {
            formattedDate = transaction.date;
          } else {
            console.warn(
              "Unexpected date format from model for ID",
              id,
              transaction.date
            );
          }
        } catch (e) {
          console.error(
            "Error processing date from model for ID",
            id,
            transaction.date,
            e
          );
          formattedDate = null;
        }
      } else {
        console.warn("Transaction date is null or undefined for ID", id);
      }

      const responseTransaction = {
        id: transaction.id,
        amount: Number(transaction.amount),
        description: transaction.description || "",
        date: formattedDate,
        categoryId: transaction.categoryId,
        userId: transaction.userId,
        type: transaction.type,
        categoryName: transaction.categoryName || null,
      };

      console.log(
        "Sending explicitly constructed and formatted transaction object:",
        responseTransaction
      );
      res.json(responseTransaction);
    } catch (error) {
      console.error(
        `Error fetching transaction by ID ${id} for User ID ${userId}:`,
        error
      );
      res.status(500).json({ msg: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const userId = req.user.userId;
      console.log(
        `Attempting to fetch all transactions for User ID: ${userId}`
      );
      const [transactions] = await Transaction.getByUserId(userId);

      // Format data sebelum dikirim ke client
      const formattedTransactions = transactions.map((transaction) => {
        let formattedDate;
        try {
          const dateObject = new Date(transaction.date);
          formattedDate = !isNaN(dateObject.getTime())
            ? dateObject.toISOString().split("T")[0]
            : transaction.date
            ? transaction.date.split("T")[0]
            : null;
        } catch (e) {
          console.error(
            `Error formatting date in getAll for transaction ID ${transaction.id}:`,
            transaction.date,
            e
          );
          formattedDate = null;
        }

        let formattedAmount;
        try {
          formattedAmount = Number(transaction.amount);
          if (isNaN(formattedAmount)) {
            console.warn(
              `Warning: Invalid amount in getAll for transaction ID ${transaction.id}.`,
              transaction.amount
            );
            formattedAmount = 0;
          }
        } catch (e) {
          console.error(
            `Error formatting amount in getAll for transaction ID ${transaction.id}:`,
            transaction.amount,
            e
          );
          formattedAmount = 0;
        }

        return {
          ...transaction,
          amount: formattedAmount,
          date: formattedDate,
        };
      });

      console.log("Sending formatted transactions:", formattedTransactions);
      res.json(formattedTransactions);
    } catch (error) {
      console.error(
        `Error fetching all transactions for User ID ${userId}:`,
        error
      );
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
      console.log(
        `Attempting to fetch transactions by date range for User ID: ${userId}, Start: ${startDate}, End: ${endDate}`
      );

      const [transactions] = await Transaction.getByDateRange(
        userId,
        startDate,
        endDate
      );

      // Format data sebelum dikirim ke client
      const formattedTransactions = transactions.map((transaction) => {
        let formattedDate;
        try {
          const dateObject = new Date(transaction.date);
          formattedDate = !isNaN(dateObject.getTime())
            ? dateObject.toISOString().split("T")[0]
            : transaction.date
            ? transaction.date.split("T")[0]
            : null;
        } catch (e) {
          console.error(
            `Error formatting date in getByDateRange for transaction ID ${transaction.id}:`,
            transaction.date,
            e
          );
          formattedDate = null;
        }

        let formattedAmount;
        try {
          formattedAmount = Number(transaction.amount);
          if (isNaN(formattedAmount)) {
            console.warn(
              `Warning: Invalid amount in getByDateRange for transaction ID ${transaction.id}.`,
              transaction.amount
            );
            formattedAmount = 0;
          }
        } catch (e) {
          console.error(
            `Error formatting amount in getByDateRange for transaction ID ${transaction.id}:`,
            transaction.amount,
            e
          );
          formattedAmount = 0;
        }

        return {
          ...transaction,
          amount: formattedAmount,
          date: formattedDate,
        };
      });

      console.log(
        "Sending formatted transactions by date range:",
        formattedTransactions
      );
      res.json(formattedTransactions);
    } catch (error) {
      console.error(
        `Error fetching transactions by date range for User ID ${userId}:`,
        error
      );
      res.status(500).json({ msg: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { amount, categoryId, date, description, type } = req.body;
      const userId = req.user.userId;

      console.log(
        `Attempting to update transaction with ID: ${id} for User ID: ${userId} with data:`,
        req.body
      );

      await Transaction.update(id, userId, {
        amount,
        categoryId,
        date,
        description,
        type,
      });

      console.log(`Transaction with ID ${id} updated successfully.`);
      res.json({ msg: "Transaksi berhasil diupdate" });
    } catch (error) {
      console.error(
        `Error updating transaction with ID ${id} for User ID ${userId}:`,
        error
      );
      res.status(500).json({ msg: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      console.log(
        `Attempting to delete transaction with ID: ${id} for User ID: ${userId}`
      );

      await Transaction.delete(id, userId);
      console.log(`Transaction with ID ${id} deleted successfully.`);
      res.json({ msg: "Transaksi berhasil dihapus" });
    } catch (error) {
      console.error(
        `Error deleting transaction with ID ${id} for User ID ${userId}:`,
        error
      );
      res.status(500).json({ msg: error.message });
    }
  },
};
