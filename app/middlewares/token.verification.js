const fs = require("fs");
const PRIVATE_KEY = fs.readFileSync("./private.key", "utf8");
const jwt = require("jsonwebtoken");

const TokenVerification = async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.body.access_token, PRIVATE_KEY);
    if (decodedToken) {
      req.decodedToken = decodedToken;
      next();
    } else {
      res.status(403).json({ message: "Forbidden", status: 403 });
    }
  } catch (error) {
    res.status(403).json({ message: "Forbidden", status: 403 });
  }
};

module.exports = TokenVerification;
