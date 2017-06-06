'use strict';

const { Router } = require('express');

const version = require('../version');


const router = new Router();


router.get('/*', (req, res, next) => {
  res.header('RATATOSKR-VERSION', version.tag);
  next();
});


// Return version
router.get('/version', (req, res, next) => {
  res.json({version: version.tag});
});


// Mark any API-request as 'Not found' if user is not authenticated
router.use((req, res, next) => {
  if (!req.user) {
    res.status(401).json({status: 'Unauthorized'});
  } else {
    next();
  }
});


// Return user data
router.get('/user/me', (req, res, next) => {
  res.json({user: req.user.getAPIRepresentation()});
});


module.exports = router;
