const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/adminRoutes");
const gigRoutes = require("./routes/gig.routes");
const applicationRoutes = require("./routes/application.routes");
const cvRoutes = require("./routes/cv.routes");
const contactRoutes = require("./routes/contact.routes");

const app = express();


app.use(cookieParser());


app.use(
  cors({
    origin: true, 
    credentials: true,
  })
);


app.use(express.json());


app.get("/", (req, res) => {
  res.send("K-Gigs Backend API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api/contact", contactRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

module.exports = app;