const express = require('express')
const router = express.Router()
const Note = require('../models/Note')

const { isAuthenticated } =  require('../helpers/auth')

//Renderiza el formulario de add notas
router.get('/notes/add', isAuthenticated, (req, res) => {
  res.render('notes/new-notes')
})

//REgistra las notas
router.post('/notes/new-notes', isAuthenticated, async (req, res) => {
  const { title, description } = req.body;
  const errors = []
  if (!title) {
    errors.push({ text: 'Please write a title' })
  }
  if (!description) {
    errors.push({ text: 'Please write a description' })
  }
  if (errors.length > 0) {
    res.render('notes/new-notes', {
      errors,
      title,
      description
    })
  }
  else {
    const newNote = new Note({ title, description })
    newNote.user = req.user.id
    await newNote.save();
    req.flash('success_msg', 'Note Add Successfully') /* CREAR EL MENSAJE */
    res.redirect('/notes')
  }
})

//Consulta las notas
router.get('/notes', isAuthenticated, async (req, res) => {
  const notes = await Note.find({user: req.user.id}).sort({ created_at: 'desc' }).lean()  
  res.render('notes/all-notes', { notes })
})

//Recibe el parametro, hace la consulta y renderiza la vista para editar
router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
  const note = await Note.findById(req.params.id).lean()
  res.render('notes/edit-note', { note })
})

//Edita los campos
router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
  const { title, description } = req.body
  await Note.findByIdAndUpdate(req.params.id, { title, description })
  req.flash('success_msg', 'Note update successfully')
  res.redirect('/notes')
})

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id)
  req.flash('success_msg', 'Note deleted successfully')
  res.redirect('/notes')
})

module.exports = router