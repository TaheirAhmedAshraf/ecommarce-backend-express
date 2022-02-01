const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

// Body Parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// cors
const cors = require("cors");
const corsOptions = {
  origin: "*",
  methods: "*",
  allowedHeaders: "*",
};
app.use(cors(corsOptions));

// ENVIRONMENT VARIABLES
const PORT = process.env.PORT || 8000;
const { MONGO_URI } = process.env;

// Public Routes
const AuthRoutes = require("./app/routes/auth.routes");
app.use("/api/auth", AuthRoutes);

// Middlewares
const TokenVerification = require("./app/middlewares/token.verification");
app.use(TokenVerification);

// Private Routes
const UserRoutes = require("./app/routes/user.routes");
app.use("/api/user", UserRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected with monogoDB");
    })
    .catch((err) => {
      console.log(err.message);
    });
});
