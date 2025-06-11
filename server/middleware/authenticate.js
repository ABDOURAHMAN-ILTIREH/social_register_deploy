const jwt = require("jsonwebtoken");
const { User } = require('../models');

// Middleware to verify JWT from Authorization header
const authenticateToken = async (req, res, next) => {
  // Get token from cookie 
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);

    const user = await User.findOne({
      where: { id: decoded._id },
    });

    if (!user) {
      // Clear invalid token
      res.clearCookie('token');
      return res.status(401).json({ error: "Utilisateur non trouvé." });
    }

    req.user = user;
    next();
  } catch (error) {
    // Clear invalid token
    res.clearCookie('token');
    return res.status(401).json({ error: "Échec de l'authentification." });
  }
};

// Middleware to check if user is 'chef_de_service' or 'coordinateur'
const authorizeAdmin = (req, res, next) => {
  const allowedRoles = ['chef_de_service', 'coordinateur'];

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Access denied: Admin role required.' });
  }

  next();
};

module.exports = { authenticateToken, authorizeAdmin };
