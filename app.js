const express = require('express')
const authRoutes = require('./routes/outh-routes')
const profileRoutes = require('./routes/profile-routes')
const passportSetup = require('./config/passport-setup')
const {db} = require('./db')
const keys = require('./config/keys');
const cookieSession = require('cookie-session')
const passport = require('passport')

const app = express()

// set up view engine
app.set('view engine', 'ejs')

app.use(cookieSession ({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [keys.session.cookieKey]
}))

// initialize passport
app.use(passport.initialize())
app.use(passport.session())

// set up authRoutes
app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)

// create home route
app.get('/', (req, res) => {
  res.render('home')
})

db.sync()
  .then(() => {
    console.log('The database is synced!')
    app.listen(3000, () => console.log(`

      Listening on port
      http://localhost:3000/

    `))
  })
