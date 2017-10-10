'use strict';

const { Router } = require('express');

const environment = require('../lib/environment');

const router = new Router();


router.get('/robots.txt', (req, res, next) => {
  let robots;

  if (environment.production && !environment.native) {
    robots = 'User-agent: *\r\n';
  } else {
    robots = 'User-agent: *\r\nDisallow: /';
  }

  res.type('text/plain').send(robots);
});


module.exports = router;
