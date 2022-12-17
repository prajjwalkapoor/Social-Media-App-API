const jsonwebtoken = require("jsonwebtoken");

module.exports = (user, statusCode, res) => {
  const token = jsonwebtoken.sign(
    { email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
  res.status(statusCode).json({
    success: true,
    token,
  });
};
