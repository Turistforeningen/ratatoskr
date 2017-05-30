'use strict';

const redis = require('./redis');


exports.middleware = (req, res, next) => {
  redis.hgetall(req.session.user)
    .then((data) => { // eslint-disable-line consistent-return
      const user = JSON.parse(data.user);

      // TODO(Roar): Protected resource
      if (user.is_authenticated !== true) {
        return res.redirect(`/?next=${req.originalUrl}`);
      }

      next();
    })
    .catch((err) => res.redirect(`/?next=${req.originalUrl}`));
};
