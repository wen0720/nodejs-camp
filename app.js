const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express();

console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
})

// tourRouter/userRouter 也是一個 middleware
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter);

// handle unhandle routes
app.all('*', (req, res, next) => {
  // res.status(400).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl}.`
  // })

  const err = new Error(`Can't find ${req.originalUrl} on this server`);
  err.status = 'fail';
  err.statusCode = 404;

  next(err); // express 會一律把丟進 next 的參數視為 err
});

app.use((err, req, res, next) => {
  err.statusCode =  err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  })
});

module.exports = app;
