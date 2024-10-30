const express = require('express')
const router = express.Router()
const User = require('../models/User')
const passport = require('passport')

router.get('/users/signin', (req, res) => {
  res.render('users/signin')
})

//local es un nombre por defecto
router.post('/users/signin', passport.authenticate('local', {
  successRedirect: '/notes',
  failureRedirect: '/users/signin',
  failureFlash: true
}))

router.get('/users/signup', (req, res) => {
  res.render('users/signup')
})

router.post('/users/signup', async (req, res) => {
  const { name, email, password, confirm_password } = req.body
  const errors = []
  if (name.length <= 0) {
    errors.push({ text: 'Please insert your name' })
  }
  if (password != confirm_password) {
    errors.push({ text: 'Password do not match' })
  }
  if (password.length < 4) {
    errors.push({ text: 'Password must be at least 4 characters' })
  }
  if (errors.length > 0) {
    res.render('users/signup', { errors, name, email, password, confirm_password })
  }
  else {
    const emailExist = await User.findOne({ email: email })
    if (emailExist) {
      //Agrego el error al array de errores y lo envio cuando renderizo, ya que no puedo usar el flash
      //porque el render recarga la pagina
      errors.push({ text: 'This email is in used' })
      res.render('users/signup', { errors, name, email, password, confirm_password })
    }
    else {
      const newUser = new User({ name, email, password })
      newUser.password = await newUser.encryptPassword(password)
      await newUser.save()
      req.flash('success_msg', 'User saved successfully')
      res.redirect('/users/signin')
    }
  }
})

//Logout
router.get('/users/logout', (req, res) => {
  // req.logout()
  // res.redirect('/')
  req.logout((err) => {
    if (err) {
        return next(err); // Pasa el error al middleware de manejo de errores
    }
    res.redirect('/'); // Redirige a la página de inicio de sesión
});
})
module.exports = router





