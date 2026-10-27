const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role: role },
    process.env.JWT_SECRET || 'imovies_super_secret_jwt_key_2026_xyz',
    {
      expiresIn: '30d',
    }
  );
};

module.exports = generateToken;
