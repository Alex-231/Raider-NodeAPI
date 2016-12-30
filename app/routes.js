
module.exports = function(app, User, jwt, express) {

    // API ROUTES -------------------

    // get an instance of the router for api routes
    var apiRoutes = express.Router(); 

    // TODO: route to authenticate a user (POST http://localhost:8080/api/authenticate)

    // TODO: route middleware to verify a token

    // debug route (GET http://localhost:8080/api/debug)
    // apiRoutes.get('/debug', function(req, res) {

    //     // create a sample user
    //     var nick = new User({ 
    //         name: 'Nick Cerminara', 
    //         password: 'password',
    //         admin: false 
    //     });

    //     // save the sample user
    //     nick.save(function(err) {
    //         if (err) throw err;

    //         console.log('User saved successfully');
    //         res.json({ success: true });
    //     });
    // });

    // route to show a random message (GET http://localhost:8080/api/)
    apiRoutes.get('/', function(req, res) {
        res.json({ message: 'Welcome to the coolest API on earth!' });
    }); 

    apiRoutes.post('/authenticate', function(req, res) {

        // find the user
        User.findOne({
            name: req.body.name
        }, function(err, user) {

            if (err) throw err;

            if (!user) {
                //User not found.
                res.json({ success: false, message: 'Authentication failed. Invalid Credentials.' });
            } else if (user) {

                // check if password matches
                if (user.password != req.body.password) {
                    //Wrong password.
                    res.json({ success: false, message: 'Authentication failed. Invalid Credentials.' });
                } else {

                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign(user, app.get('superSecret'), {
                        expiresIn: '1440m' // expires in 24 hours expires In Minutes has been depricated.
                    });

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }   

            }

        });
    });

    // route middleware to verify a token
    apiRoutes.use(function(req, res, next) {

        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });    
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;    
                    next();
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(401).send({ 
                success: false, 
                message: 'No token provided.' 
            });

        }
    });

    // route to return all users (GET http://localhost:8080/api/users)
    apiRoutes.get('/users', function(req, res) {
        User.find({}, function(err, users) {
            res.json(users);
        });
    });  

    // apply the routes to our application with the prefix /api
    app.use('/api', apiRoutes);

}