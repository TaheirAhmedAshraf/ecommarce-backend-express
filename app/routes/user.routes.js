const express = require("express");
const UserModel = require("../models/user.model");
const router = express();

router.post("/userinfo", async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const user = decodedToken.user;
    const user_data = await UserModel.findOne({ user_id: user.user_id });
    const user_info = {
      first_name: user_data.first_name,
      last_name: user_data.last_name,
      email: user_data.email,
      user_id: user_data.user_id,
      creation_date: user_data.creation_date,
    };
    res.status(200).json({ status: 200, user_info });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
    });
  }
});

module.exports = router;
