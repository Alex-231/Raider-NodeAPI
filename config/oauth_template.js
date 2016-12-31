//I don't wan't to commit my oauth setup,
//So enter your own setup here.
//Callbacks must match integrations.

var ids = {
    github: {
        clientID: '',
        clientSecret: '',
        callbackURL: "http://localhost:3000/api/auth/github/callback"
    },
    google: {
        clientID: '',
        clientSecret: '',
        callbackURL: 'http://localhost:3000/api/auth/google/callback'
    }
};

module.exports = ids;