var express = require('express');
var passport = require('passport');
var config = require('../../config/main');

module.exports = function(app) {

    //Import passport strat.
    require('../../config/passport')(passport);

    //API routes.
    var apiRoutes = express.Router();

    //Health route for OpenShift monitoring.
    app.get("/health", function(req, res) {
        res.json({ success: true, message: 'success' });
    });

    //Protect dashboard route with jwt,
    apiRoutes.get('/protected', passport.authenticate('jwt', { session: false, failureRedirect: '/api/errors/unauthorized' }), function(req, res) {
        res.send('It worked! User id is: ' + req.user._id + '.');
    });

    apiRoutes.get("/errors/unauthorized", function(req, res) {
        res.json({ success: false, message: 'unauthorized' });
    });

    //Set url for API group routes.
    apiRoutes.use('/auth', require('./auth'));
    apiRoutes.use('/clan', require('./clan'));
    apiRoutes.use('/user', require('./user'));
    //apiRoutes.use('/debug', require('./debug')); //There's probably a variable I can use to enable this.
    app.use('/api', apiRoutes);

    //Should probably move this later.
    //Home route
    // app.get('/', function(req, res) {
    //     res.send('Homepage route.')
    // })
};