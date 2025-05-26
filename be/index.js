// Server backend
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import UserRoute from "./route/UserRoute.js";
import TransactionRoute from "./route/TransactionRoute.js";
import CategoryRoute from "./route/CategoryRoute.js";
import PlanRoute from "./route/PlanRoute.js";
import { syncDatabase } from "./config/db.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware untuk cache control
app.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
});

// Middleware untuk logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  // 'https://frontend-moneytracker-dot-b-08-450916.uc.r.appspot.com', // GCP URL (dikomentari)
  'https://fe-projek-akhir-dot-b-08-450916.uc.r.appspot.com/' // GCP URL (dikomentari)
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
      transactions: "/api/transaction",
      categories: "/api/category",
      auth: "/api/user",
    },
    timestamp: new Date().toISOString(),
  });
});

// Use routes
app.use("/api/user", UserRoute);
app.use("/api/transaction", TransactionRoute);
app.use("/api/category", CategoryRoute);
app.use("/api/plan", PlanRoute);

// Initialize database
syncDatabase();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    status: "error",
    message: "Terjadi kesalahan pada server",
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
