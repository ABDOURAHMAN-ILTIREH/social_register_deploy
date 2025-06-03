const jwt = require("jsonwebtoken");


const create_Token = (id) =>{
    return jwt.sign({_id:id}, process.env.SECRET , {expiresIn: "7h"});
}

// Generate password reset token
const createResetToken = (id) => {
  return jwt.sign({ _id: id, purpose: 'password_reset' },process.env.RESET_SECRET,{ expiresIn: '15m' }
  );
};

module.exports = { 
  create_Token, 
  createResetToken,
};
