const jsonWebToken = require("jsonwebtoken");

const authVerify = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (header === null || header === undefined) {
      return res.status(402).json({
        message: "Missing Token",
        error: null,
      });
    }

    let token = header.split(" ")[1];
    const secretKey = process.env.SECRET_KEY;

    let decodedToken;
    try {
      decodedToken = await jsonWebToken.verify(token, secretKey);
    } catch (error) {
      if (error instanceof jsonWebToken.TokenExpiredError) {
        return res.status(401).json({
          message: "token expired",
          error: error.message,
        });
      }
      
      return res.status(401).json({
        message: "invalid token",
        error: error.message,
      });
    }

    req.userData = decodedToken;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server error",
      error: error.message,
    });
  }
};

module.exports = { authVerify };