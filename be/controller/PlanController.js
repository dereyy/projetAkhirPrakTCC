import {
  createPlan,
  getPlansByUserId,
  getPlanById,
  updatePlan,
  deletePlan,
  updateRemainingAmount,
} from "../model/PlanModel.js";

export const createPlanController = async (req, res) => {
  try {
    const { categoryId, amount, description } = req.body;
    console.log("User data:", req.user); // Log untuk memeriksa isi req.user
    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({
        msg: "User ID tidak ditemukan",
      });
    }

    if (!categoryId || !amount || !description) {
      return res.status(400).json({
        msg: "Semua field harus diisi",
      });
    }

    const result = await createPlan({
      userId,
      categoryId,
      amount,
      description,
      remainingAmount: amount,
    });

    res.status(201).json({
      msg: "Perencanaan berhasil dibuat",
      data: {
        id: result[0].insertId,
        userId,
        categoryId,
        amount,
        description,
        remainingAmount: amount,
      },
    });
  } catch (error) {
    console.error("Error creating plan:", error);
    res.status(500).json({
      msg: "Gagal membuat perencanaan",
      error: error.message,
    });
  }
};

export const getPlansController = async (req, res) => {
  try {
    const userId = req.user.userId; // Mengambil userId dari req.user.userId
    const plans = await getPlansByUserId(userId);
    res.json(plans[0]);
  } catch (error) {
    console.error("Error getting plans:", error);
    res.status(500).json({
      msg: "Gagal mengambil data perencanaan",
      error: error.message,
    });
  }
};

export const getPlanByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await getPlanById(id);

    if (plan[0].length === 0) {
      return res.status(404).json({
        msg: "Perencanaan tidak ditemukan",
      });
    }

    res.json(plan[0][0]);
  } catch (error) {
    console.error("Error getting plan:", error);
    res.status(500).json({
      msg: "Gagal mengambil data perencanaan",
      error: error.message,
    });
  }
};

export const updatePlanController = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, remainingAmount } = req.body;

    if (!amount || !description || !remainingAmount) {
      return res.status(400).json({
        msg: "Semua field harus diisi",
      });
    }

    const result = await updatePlan(id, {
      amount,
      description,
      remainingAmount,
    });

    if (result[0].affectedRows === 0) {
      return res.status(404).json({
        msg: "Perencanaan tidak ditemukan",
      });
    }

    res.json({
      msg: "Perencanaan berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating plan:", error);
    res.status(500).json({
      msg: "Gagal memperbarui perencanaan",
      error: error.message,
    });
  }
};

export const deletePlanController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deletePlan(id);

    if (result[0].affectedRows === 0) {
      return res.status(404).json({
        msg: "Perencanaan tidak ditemukan",
      });
    }

    res.json({
      msg: "Perencanaan berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting plan:", error);
    res.status(500).json({
      msg: "Gagal menghapus perencanaan",
      error: error.message,
    });
  }
};

export const updateRemainingAmountController = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        msg: "Jumlah harus diisi",
      });
    }

    const result = await updateRemainingAmount(id, amount);

    if (result[0].affectedRows === 0) {
      return res.status(404).json({
        msg: "Perencanaan tidak ditemukan",
      });
    }

    res.json({
      msg: "Sisa jumlah berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating remaining amount:", error);
    res.status(500).json({
      msg: "Gagal memperbarui sisa jumlah",
      error: error.message,
    });
  }
};
