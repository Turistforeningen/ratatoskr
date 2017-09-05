'use strict';

const { Router } = require('express');
const morgan = require('morgan');

const serviceWorkerController = require('./service-worker');
const apiController = require('./api');


const router = new Router();

// Access logs
router.use(morgan('combined'));


// Return React app if user is authenticated or redirect to login
router.get('/', (req, res, next) => res.render('app.html'));

// Add controllers
router.use('/', serviceWorkerController);
router.use('/api', apiController);


module.exports = router;
