// Server backend
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// Import routes
import TransactionRoute from "./route/TransactionRoute.js"; // untuk fitur transaksi
import CategoryRoute from "./route/CategoryRoute.js"; // untuk fitur kategori
import UserRoute from "./route/UserRoute.js"; // untuk auth/user
import PlanRoute from "./route/PlanRoute.js"; // untuk fitur perencanaan

const app = express();
dotenv.config();

// Middleware untuk logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  // 'https://frontend-moneytracker-dot-b-08-450916.uc.r.appspot.com', // GCP URL (dikomentari)
  // 'https://fe-moneytracker-505940949397.us-central1.run.app' // GCP URL (dikomentari)
];

app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
  })
);

app.use(express.json());

// Health check endpoints
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running 🚀",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api", (req, res) => {
  res.json({
    status: "ok",
    message: "API is running",
    endpoints: {
      transactions: "/api/transactions",
      categories: "/api/categories",
      auth: "/api/user",
    },
    timestamp: new Date().toISOString(),
  });
});

// Use routes
app.use("/api/transactions", TransactionRoute);
app.use("/api/categories", CategoryRoute);
app.use("/api/user", UserRoute);
app.use("/api/plans", PlanRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    msg: "Terjadi kesalahan pada server",
    error: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint tidak ditemukan",
  });
});

// Start server
const PORT = process.env.PORT || 5001;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`Server berjalan di http://${HOST}:${PORT}`);
  console.log("CORS diaktifkan untuk:", allowedOrigins);
});
