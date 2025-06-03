const { hash, compare} = require("../util/password.bcrypt");
const { create_Token } = require("../util/token")
const  {User}  = require('../models');


const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Vérifier que tous les champs sont fournis
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Vous devez fournir un nom, un email et un mot de passe.' });
    }

      if (typeof password !== 'string') {
    return res.status(400).json({ error: "Password must be a string." });
  }
    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Hash the password
    const hashPassword = hash(password);

    // Créer un nouvel utilisateur
    const newUser = await User.create({ 
      name: name ? name.toLowerCase() : name, 
      email:email ? email.toLowerCase():email, 
      password: hashPassword 
    });

    // Générer un token JWT
    create_Token(newUser.id); // Remplacez 'votre_secret_jwt' par une clé secrète sécurisée

    // Renvoyer une réponse réussie
    res.status(201).json({ message: 'Utilisateur enregistré avec succès',newUser });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error: error.message });
  }
};


const login = async (req,res) =>{
    let { email, password} = req.body;
    
    try {
        if(!email || !password){
            throw new Error('You must provide an email and an password.');
        }
        
        const users = await User.findOne({
            where: {
                email
            }
        });

        if(!users){
            return res.status(400).json({ message: 'Invalid login credentials.' });
        }
        
        let match = compare(password, users.password);
        if(!match){
            return res.status(400).json({ message: 'Password or email not correct!' });
        }
        
        const token = create_Token(users.id);

      // Stocke le token dans un cookie HTTP-only
      res.cookie('token', token, {
        httpOnly: true,
        secure: true, // mettre true en production (HTTPS)
        sameSite: 'lax',
        maxAge: 3600000 // 1 heure
      });
        
    res.json({ message: 'Connecté avec succès',users });
        
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true, // 🔒 mettre true si HTTPS en prod
    sameSite: 'none',
  });
  return res.status(200).json({ message: 'Déconnecté avec succès' });
};

module.exports = { register ,login,logout};
