// controllers/userController.js
const { User } = require('../models');
const jwt = require("jsonwebtoken");
const {  Op } = require('sequelize');
const crypto = require('crypto');
const { hash, compare} = require("../util/password.bcrypt");
const { createResetToken } = require('../util/token');
const { sendResetPasswordEmail } = require('../services/emailService');


// Créer un utilisateur
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.create({ name, email, password, role });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error });
  }
};

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    // req.user est injecté par votre middleware authenticateToken
    if (!req.user) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }
    
    const { id, name, email,role} = req.user;
    
    res.status(200).json({ id, name, email, role });

  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l’utilisateur', error });
  }
};


// Récupérer un utilisateur par ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur', error });
  }
};

// Mettre à jour un utilisateur


// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(204).json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur', error });
  }
};


exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  try {
    // 1. Trouver l'utilisateur
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // 4. Mettre à jour le mot de passe
    await User.update({ 
      name: name ? name.toLowerCase() : name, 
      email:email ? email.toLowerCase():email, 
      role 
       }, { where: { id: req.params.id } });
  
    return res.json({ message: "mis à jour avec succès" });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du utilisateur:', error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};



exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      // Don't reveal if user doesn't exist for security
      return res.status(200).json({ 
        message: 'If this email exists, a reset link has been sent' 
      });
    }

    // Create reset token
    const resetToken = createResetToken(user.id);
    console.log(resetToken);
    // Store hashed token in DB
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    await user.update({
      resetToken: resetTokenHash,
      resetTokenExpiry: Date.now() + 900000 // 15 minutes
    });


    // Send email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
 
    await sendResetPasswordEmail({
      to: user.email,
      resetLink:resetUrl
    });

    res.status(200).json({ message: 'Password reset email sent'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing request' });
  }
};


exports.resetPassword = async (req, res) => {
  const {token, newPassword } = req.body;
  

  // Validate input
  if (!newPassword) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  try {
    // Verify JWT reset token with the correct secret
    const decoded = jwt.verify(token, process.env.RESET_SECRET); // Note: Different from your main SECRET
    
    if (decoded.purpose !== 'password_reset') {
      return res.status(400).json({ message: 'Invalid token purpose' });
    }

    // Hash the token to compare with stored hash
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    const user = await User.findOne({
      where: {
        id:decoded._id,
        resetToken: tokenHash,
        resetTokenExpiry:  { [Op.gt]: Date.now() } // Check if token hasn't expired
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Utilisateur non trouvé.' });
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Update password
    const hashPassword = hash(newPassword);

    await user.update({
      password: hashPassword,
      resetToken: null,
      resetTokenExpiry: null,
      tokenVersion: user.tokenVersion + 1 // Invalidate all existing sessions
    });

    return res.status(200).json({ message: 'Password updated successfully' });

  } catch (error) {
    return res.status(400).json({ message: 'Password reset failed' });
  }
};