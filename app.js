const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const errorController = require('./controllers/errorController');

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
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404)); // express 會一律把丟進 next 的參數視為 err
});

app.use(errorController);

module.exports = app;
