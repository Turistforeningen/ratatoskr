'use strict';

const { Router } = require('express');


const router = new Router();


// Logout handler
router.get('/', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});


module.exports = router;
