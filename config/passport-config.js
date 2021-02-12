const LocalStrategy = require('passport-local').Strategy;
const { getUserByEmail, getUserById } = require('../controller/dbService');
const bcrypt = require('bcrypt');
const { authenticate } = require('passport');



function initialize(passport) {

    async function authenticateUser(email, password, done) {

        try {
            const user = await getUserByEmail(email);
            if (!user) {
                return done(null, false, { message: 'No user with that email' })
            }
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: "Password incorrect" })
            }

        }

        catch (err) {
            return done(null, false, { message: "Error While logging in. Please try again." })
        }

    }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {

        const user = await getUserById(id)
        done(null, user)
    })
}



module.exports = initialize;

