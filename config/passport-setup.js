const passport = require('passport')
const GoogleSt = require('passport-google-oauth20')
const keys = require('./keys')
const {User} = require('../db')

passport.serializeUser((user, done)=>{
  done(null, user.id);
})

passport.deserializeUser((id, done)=>{
  User.findById(id).then((user)=>{
      done(null, user);
  })
})

passport.use(
  new GoogleSt({
  // options for the google strat
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: '/auth/google/redirect'
  },(accessToken, refreshToken, profile, done) => {
  // passport cb func

  console.log(profile)
  // check if user already exist in our db
  User.findOne({googleId: profile.id}).then((curUser)=> {
    if(curUser) {
      done(null, curUser)
    } else {
      new User({
        googleId: profile.id,
        email: profile.emails[0].value
      }).save().then((newUser) => {
        done(null, newUser)
      })
    }
  })
  .catch(done)
  })
)
