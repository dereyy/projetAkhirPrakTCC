import { Transaction } from "../model/Transaction.js";
import {
  getPlanByCategoryAndUser,
  updateRemainingAmount,
} from "../model/PlanModel.js";

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

      // Buat transaksi
      const result = await Transaction.create({
        userId,
        amount: Number(amount),
        categoryId,
        date,
        description: description || "",
        type,
      });

      // Jika transaksi adalah pengeluaran, update remainingAmount di plans
      if (type === "expense") {
        try {
          // Cari plan yang sesuai dengan kategori dan user
          const [plans] = await getPlanByCategoryAndUser(categoryId, userId);

          if (plans && plans.length > 0) {
            const plan = plans[0];
            // Update remainingAmount
            await updateRemainingAmount(plan.id, Number(amount));
            console.log("Updated remaining amount for plan:", plan.id);
          }
        } catch (error) {
          console.error("Error updating plan remaining amount:", error);
          // Tidak mengembalikan error karena transaksi sudah berhasil dibuat
        }
      }

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

      const [transactionResult] = await Transaction.getById(id, userId);
      // Database query result is an array of rows, get the first row
      const transaction = transactionResult ? transactionResult[0] : null;

      console.log("Raw transaction data from model:", transaction);

      if (!transaction) {
        console.warn(
          `Transaction with ID ${id} not found for User ID ${userId}`
        );
        return res.status(404).json({ msg: "Transaksi tidak ditemukan" });
      }

      // Log specific properties from the raw transaction object
      console.log("Properties directly from model result:", {
        id: transaction.id,
        amount: transaction.amount,
        date: transaction.date,
        categoryId: transaction.categoryId,
        userId: transaction.userId,
        type: transaction.type,
        description: transaction.description,
        categoryName: transaction.categoryName,
      });

      // Explicitly construct the response object with all necessary properties
      // Ensure all expected properties are present, even if null/undefined from DB
      const responseTransaction = {
        id: transaction.id || null, // Use null if undefined/null from DB
        amount: Number(transaction.amount) || 0, // Ensure amount is a number, default to 0
        description: transaction.description || "", // Default to empty string
        date: transaction.date || null, // Use null if undefined/null
        categoryId: transaction.categoryId || null, // Use null if undefined/null
        userId: transaction.userId || null, // Use null if undefined/null
        type: transaction.type || null, // Use null if undefined/null
        categoryName: transaction.categoryName || null, // Use null if undefined/null
      };

      // Format date for the response object (frontend expects YYYY-MM-DD)
      if (responseTransaction.date) {
        try {
          const dateObject = new Date(responseTransaction.date);
          if (!isNaN(dateObject.getTime())) {
            responseTransaction.date = dateObject.toISOString().split("T")[0];
          } else if (
            typeof responseTransaction.date === "string" &&
            responseTransaction.date.length >= 10
          ) {
            responseTransaction.date = responseTransaction.date.substring(
              0,
              10
            ); // Fallback for string date
          } else {
            console.warn(
              "Unexpected date format during formatting for ID",
              id,
              responseTransaction.date
            );
            responseTransaction.date = null;
          }
        } catch (e) {
          console.error(
            "Error formatting date for ID",
            id,
            responseTransaction.date,
            e
          );
          responseTransaction.date = null;
        }
      }

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
      const transactionId = req.params.id;
      const requestUserId = req.user.userId;
      console.error(
        `Error fetching transaction by ID ${transactionId} for User ID ${requestUserId}:`,
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
