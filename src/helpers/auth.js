const helpers = {}

helpers.isAuthenticated = (req, res, next) => {
  //isAuthenticated nombre Default de passport
  if(req.isAuthenticated()){
    return next()
  }  
  else{
    req.flash('error_msg', 'Login to continue.')
    res.redirect('/users/signin')
  }
}

module.exports = helpers