const LocalStrategy = require('passport-local').Strategy;
const dbService = require('./dbService');
const bcrypt = require('bcrypt');
const { authenticate } = require('passport');



function initialize(passport) {

    async function authenticateUser(email, password, done) {
        //Match user
        const result = dbService.getUserByEmail(email);
        result
            .then(async (user) => {
                // check for no user
                if (!user) {
                    return done(null, false, { message: 'No user with that email' })
                }
                try {
                    //Match password
                    if (await bcrypt.compare(password, user.password)) {
                        return done(null, user)
                    } else {
                        return done(null, false, { message: "Password incorrect" })
                    }


                } catch (err) {
                    return done(err)
                }

            })
            .catch(err => console.log(err))
    }



    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser((id, done) => {
        const result = dbService.getUserById(id)
        result
            .then(user => {
                done(null, user)
            })

    })
}


module.exports = initialize;

