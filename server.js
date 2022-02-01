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

// Routes
const AuthRoutes = require("./routes/auth.routes");
app.use("/api/auth", AuthRoutes);

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
