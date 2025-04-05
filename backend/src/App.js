// External modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");

// Load environment variables
dotenv.config();

// App variables
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001", // Update this if deploying frontend separately
    methods: ["GET", "POST"],
  },
});

// MongoDB URI
const MongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 8001;
const __dirnameGlobal = path.resolve();

// Controllers
const { patientRegister } = require("./Routes/userController");
const {
  createPharmacistReq,
  searchMedicine,
} = require("./Routes/pharmacistController");
const {
  addAdmin,
  viewPatientDet,
  PatientDetailsResults,
} = require("./Routes/adminController");

// Routers
const admin = require("./Routers/adminRoute");
const pharmacist = require("./Routers/pharmacistRoute");
const patient = require("./Routers/patientRoute");
const auth = require("./Routers/authRoute");
const cart = require("./Routers/cartRoute");
const order = require("./Routers/orderRoute");

// Middleware
mongoose.set("strictQuery", false);
app.use(express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:3001", // Change to frontend domain if deploying
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

// Socket.io handlers
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

// MongoDB Connection
if (!MongoURI) {
  console.error("🚨 MongoDB URI is missing! Check your .env file.");
  process.exit(1);
}

mongoose
  .connect(MongoURI)
  .then(() => {
    console.log("✅ MongoDB connected");

    // Start server only after DB is connected
    server.listen(port, () => {
      console.log(`🚀 Server listening on http://localhost:${port}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use("/", auth);
app.use("/pharmacist", pharmacist);
app.use("/admin", admin);
app.use("/patient", patient);
app.use("/cart", cart);
app.use("/order", order);

// Serve frontend build (CRA)
app.use(express.static(path.join(__dirnameGlobal, "frontend", "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirnameGlobal, "frontend", "build", "index.html"));
});

