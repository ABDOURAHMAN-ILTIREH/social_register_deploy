const { hash, compare} = require("../util/password.bcrypt");
const { create_Token } = require("../util/token")
const  {User}  = require('../models');


const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Vous devez fournir un nom, un email et un mot de passe.' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    const hashPassword = hash(password);
    const newUser = await User.create({ 
      name: name ? name.toLowerCase() : name, 
      email: email ? email.toLowerCase() : email, 
      password: hashPassword 
    });

    const token = create_Token(newUser.id);
    
    // Set cookie instead of using session
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.status(201).json({ 
      message: 'Utilisateur enregistré avec succès',
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error: error.message });
  }
};


const login = async (req, res) => {
  let { email, password } = req.body;
    
  try {
    if (!email || !password) {
      throw new Error('You must provide an email and a password.');
    }
        
    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid login credentials.' });
    }
        
    let match = compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Password or email not correct!' });
    }
        
    const token = create_Token(user.id);

    // Set cookie instead of using session
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
        
    res.json({ 
      message: 'Connecté avec succès',
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
        
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const logout = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    
    res.status(200).json({ message: 'Déconnecté avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la déconnexion' });
  }
};

module.exports = { register ,login,logout};
