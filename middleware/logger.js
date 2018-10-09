'use strict';
const logger = (req, res, next) => {
  const logObj = {
    time: new Date().toTimeString(),
    method: req.method,
    url: req.hostname,
  };
  console.log(logObj);
  next();
};

module.exports = logger;