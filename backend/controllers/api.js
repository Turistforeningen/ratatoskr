'use strict';

const { Router } = require('express');


const router = new Router();


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

// Return user data
router.get('/user/me2', (req, res, next) => {
  res.json({user: req.user});
});


module.exports = router;
