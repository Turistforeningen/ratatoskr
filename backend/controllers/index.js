'use strict';

const { Router } = require('express');

const {middleware: requireAuth} = require('../lib/auth');
const redis = require('../lib/redis');
const User = require('../models/User');


const router = new Router();


router.get('/', (req, res, next) => {
  res.render('index.html');
});


router.get('/json', (req, res, next) => {
  res.json({user: req.user});
});


router.use('/logg-inn', require('./auth'));


router.get('/logg-ut', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
