import { Category } from "../model/Category.js";

export const CategoryController = {
  create: async (req, res) => {
    try {
      const { nama_kategori, jenis, deskripsi } = req.body;
      
      // Cek kategori sudah ada
      const [existingCategory] = await Category.getByNama(nama_kategori);
      if (existingCategory) {
        return res.status(400).json({ msg: "Kategori sudah ada" });
      }

      await Category.create({ nama_kategori, jenis, deskripsi });
      res.status(201).json({ msg: "Kategori berhasil dibuat" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const categories = await Category.getAll();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  getByJenis: async (req, res) => {
    try {
      const { jenis } = req.params;
      const categories = await Category.getByJenis(jenis);
      res.json(categories);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { nama_kategori, jenis, deskripsi } = req.body;
      await Category.update(id, { nama_kategori, jenis, deskripsi });
      res.json({ msg: "Kategori berhasil diupdate" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await Category.delete(id);
      res.json({ msg: "Kategori berhasil dihapus" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }
}; 