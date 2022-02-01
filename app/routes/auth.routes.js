const express = require("express");
const UserModel = require("../models/user.model");
const router = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const PRIVATE_KEY = fs.readFileSync("./private.key", "utf8");
const SALT_ROUNDS = 10;

router.post("/register", async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body;

    if (!email || !password || !first_name || !last_name) {
      res.status(400).json({
        message: "Please provide all the required fields",
        status: 400,
      });
    }

    const salt = bcrypt.genSaltSync(SALT_ROUNDS);
    const passwordHash = bcrypt.hashSync(password, salt);

    const user_id = `${new Date().getTime()}${Math.floor(
      Math.random() * 10000000
    )}`;

    const user = await UserModel.create({
      first_name,
      last_name,
      email,
      passwordHash,
      user_id,
      creation_date: new Date().getTime(),
    });
    console.log(user);
    const access_token = jwt.sign(user.toJSON(), PRIVATE_KEY, {
      expiresIn: "1h",
    });

    const user_info = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      user_id: user.user_id,
      creation_date: user.creation_date,
    };

    res.status(200).json({
      message: "User created successfully",
      status: 200,
      user_info,
      access_token,
    });
  } catch (error) {
    if (error.code == 11000) {
      res.status(400).json({
        message: "User already exists",
        status: 400,
      });
      return;
    }
    res.status(500).json({
      message: "Error registering new user",
      error: error.message,
      status: 500,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        status: 400,
        message: "Please provide all the required fields",
      });
    }

    const user = await UserModel.findOne({ email });
    const passwordHash = user?.passwordHash;
    bcrypt.compare(password, passwordHash, (err, result) => {
      if (!user || !result) {
        res.status(400).json({
          status: 400,
          message: "Invalid email or password",
        });
      } else {
        const access_token = jwt.sign(user.toJSON(), PRIVATE_KEY, {
          expiresIn: "1h",
        });

        const user_info = {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          user_id: user.user_id,
          creation_date: user.creation_date,
        };

        res.status(200).json({
          message: "User created successfully",
          status: 200,
          user_info,
          access_token,
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while logging in",
      error: error.message,
      status: 500,
    });
  }
});

module.exports = router;
