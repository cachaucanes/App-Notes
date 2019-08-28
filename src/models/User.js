const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const { Schema } = mongoose

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  create_at: { type: Date, default: Date.now }
})
//Cifrar contraseña
UserSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10) //Numero de veces a aplicar el hash
  const hast = bcrypt.hash(password, salt) //Toma el hast (salt) y cifra la contraseña
  return hast
}

//Comparar contraseñas
UserSchema.methods.matchPassword = async function(password){
return await bcrypt.compare(password, this.password) //comparo el password que me envia con la de la bd
}

module.exports = mongoose.model('User', UserSchema)