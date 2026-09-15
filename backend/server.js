const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const connectDB = require("./config/database");

const contactRoutes = require("./routes/contactRoutes");
const adminRoutes = require("./routes/adminRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const reportRoutes = require("./routes/reportRoutes");
const companyRoutes = require("./routes/companyRoutes");
const insightRoutes = require("./routes/insightRoutes");

connectDB();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);

app.use("/api/contact", contactRoutes);

app.get("/api/admin/test", (req, res) => {
  res.json({
    success: true,
    message: "Admin route is working"
  });
});

app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/insights", insightRoutes);

app.get("/", (req, res) => {
  res.send("Connect2Future Backend Running...");
});

// Local development only
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;