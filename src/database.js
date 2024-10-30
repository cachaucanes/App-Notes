const mongoose = require('mongoose')

console.log(process.env.HOST_MONGODB);

/* mongoose.connect('mongodb://localhost/notes-db-app', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false
}) */
/* mongoose.connect(process.env.HOST_MONGODB, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false
})
  .then(db => console.log('DB is connected'))
  .catch(err => console.log(err)) */

  mongoose.connect(process.env.HOST_MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Connection error:', error));