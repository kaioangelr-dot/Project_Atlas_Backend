require('dotenv').config();

const { PORT = 3000 } = process.env;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const mapsRouter = require('./routes/maps');
const { login, createUser } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { validateSignup, validateSignin } = require('./validations/userValidation');

const app = express();

app.use(requestLogger);
app.use(express.json({ limit: '15mb' }));
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB:', err);
  });

app.post('/signin', validateSignin, login);
app.post('/signup', validateSignup, createUser);

app.use('/users', usersRouter);
app.use('/maps', mapsRouter);

/* prettier-ignore */
app.use((req, res) => res.status(404).send({ message: 'The solicitation was not found' }));

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const { message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Server error' : message,
  });
});

app.listen(PORT);
