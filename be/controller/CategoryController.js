import { Category } from "../model/Category.js";

export const CategoryController = {
  create: async (req, res) => {
    try {
      const { name } = req.body;

      // Cek kategori sudah ada
      const [existingCategory] = await Category.getByNama(name);
      if (existingCategory) {
        return res.status(400).json({ msg: "Kategori sudah ada" });
      }

      await Category.create({ name });
      res.status(201).json({ msg: "Kategori berhasil dibuat" });
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ msg: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const [categories] = await Category.getAll();
      console.log("Categories from database:", categories);
      res.json(categories);
    } catch (error) {
      console.error("Error getting categories:", error);
      res.status(500).json({ msg: error.message });
    }
  },

  getByJenis: async (req, res) => {
    try {
      const { jenis } = req.params;
      const [categories] = await Category.getByJenis(jenis);
      res.json(categories);
    } catch (error) {
      console.error("Error getting categories by jenis:", error);
      res.status(500).json({ msg: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      await Category.update(id, { name });
      res.json({ msg: "Kategori berhasil diupdate" });
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ msg: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await Category.delete(id);
      res.json({ msg: "Kategori berhasil dihapus" });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ msg: error.message });
    }
  },
};
