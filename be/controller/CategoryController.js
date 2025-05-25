import { Category } from "../model/Category.js";

export const CategoryController = {
  create: async (req, res) => {
    try {
      console.log("Creating category with data:", req.body);
      const { name } = req.body;
      
      // Validasi input
      if (!name) {
        console.log("Name is missing");
        return res.status(400).json({ 
          msg: "Nama kategori harus diisi",
          error: "NAME_REQUIRED"
        });
      }

      if (name.trim() === '') {
        console.log("Name is empty after trim");
        return res.status(400).json({ 
          msg: "Nama kategori tidak boleh kosong",
          error: "NAME_EMPTY"
        });
      }

      // Cek apakah kategori sudah ada
      const [existingCategories] = await Category.getByNama(name.trim());
      console.log("Existing categories:", existingCategories);

      if (existingCategories && existingCategories.length > 0) {
        console.log("Category already exists:", existingCategories[0]);
        return res.status(400).json({ 
          msg: "Kategori dengan nama tersebut sudah ada",
          error: "CATEGORY_EXISTS",
          existingCategory: existingCategories[0]
        });
      }

      // Coba buat kategori baru
      const result = await Category.create({ name: name.trim() });
      console.log("Category creation result:", result);
      
      if (!result || result.affectedRows === 0) {
        console.log("Failed to create category - no rows affected");
        return res.status(500).json({ 
          msg: "Gagal membuat kategori",
          error: "CREATE_FAILED"
        });
      }

      res.status(201).json({ 
        msg: "Kategori berhasil dibuat",
        data: { id: result.insertId, name: name.trim() }
      });
    } catch (error) {
      console.error("Error creating category:", error);
      // Log detail error
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        errno: error.errno,
        sqlMessage: error.sqlMessage,
        sqlState: error.sqlState
      });
      
      res.status(500).json({ 
        msg: "Terjadi kesalahan saat membuat kategori",
        error: "SERVER_ERROR",
        details: error.message
      });
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
