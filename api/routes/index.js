/* eslint-disable no-underscore-dangle */
import configPassport from '../middleware/passport';

import authRoutes from './auth';
// import clanRoutes from './clan';
import userRoutes from './user';
import debugRoutes from './debug';

const express = require('express');
const passport = require('passport');

export default (app) => {
  // Import passport strat.
  configPassport(passport);

  // API routes.
  const apiRoutes = express.Router();

  // Health route for OpenShift monitoring.
  app.get('/health', (req, res) => {
    res.json({ success: true, message: 'success' });
  });

  // Protect dashboard route with jwt,
  apiRoutes.get('/protected', passport.authenticate('jwt', { session: false, failureRedirect: '/api/errors/unauthorized' }), (req, res) => {
    res.send(`It worked! User id is: ${req.user._id}.`);
  });

  apiRoutes.get('/errors/unauthorized', (req, res) => {
    res.json({ success: false, message: 'unauthorized' });
  });

  // Set url for API group routes.
  apiRoutes.use('/auth', authRoutes);
  // apiRoutes.use('/clan', require('./clan'));
  apiRoutes.use('/user', userRoutes);

  if (process.env.NAME !== 'Release') {
    apiRoutes.use('/debug', debugRoutes);
  }
  app.use('/api', apiRoutes);

  // Should probably move this later.
  // Home route
  // app.get('/', function(req, res) {
  //     res.send('Homepage route.')
  // })
};
