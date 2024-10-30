const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
require('dotenv').config()

//Inicializations
const app = express()
require('./database')
require('./config/passport')

//settings
app.set('port', process.env.PORT || 8080)
app.set('views', path.join(__dirname, 'views')) //Para decirle node que la carpeta views esta justo aquí
//Configuro el motor de plantilla
app.engine('hbs', exphbs.engine({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs'
}))
app.set('view engine', '.hbs') //Uso el motor de plantilla

//middlewares
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method')) //Poder enviar diferentes methodos desde el formulario
//Guardar los datos del usuario a través de una sesion
app.use(session({
  secret: 'mysecretapp',
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize()) //debe ir despues de sesión
app.use(passport.session()) //Para que utilice la sesión que se ha definido con express
app.use(flash())

//Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null
  next()
})

//Routes
app.use(require('./routes/index'))
app.use(require('./routes/notes'))
app.use(require('./routes/users'))

//Static files
app.use(express.static(path.join(__dirname, 'public')))

// Ruta comodín para redirigir rutas no definidas sin alterar las imagenes estaticas
app.get('*', (req, res) => {
  res.redirect('/');
});

//Server is listenning
app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`)
})