require('dotenv/config');

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const app = express();

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.APP_URL,
  credentials: true,
}));

function authenticate(req, res, next) {
  const token = req.cookies.auth;
  if (!token) {
    return next();
  }

  console.log(process.env.ID6_AUTHORIZATION_SECRET, token);

  axios
    .post(`${process.env.ID6_AUTHORIZATION_URL}/authorize`, { token }, {
      headers: {
        Authorization: process.env.ID6_AUTHORIZATION_SECRET,
      },
      timeout: 3000,
    })
    .then(({ data: { user, error } }) => {
      if (error) {
        throw new Error(`${error.code}: ${error.message}`);
      }
      req.user = user;
      next();
    })
    .catch(next);
}

// authorize
app.use(authenticate);

app.get('/hello', (req, res, next) => {
  const user = req.user; // set by id6
  res.json(user ? 'Authenticated' : 'Anonymous');
});

// basic JSON error handler
app.use((err, req, res, next) => {
  const status = err?.statusCode || 500;
  res.status(status).json({
    status,
    message: err.message,
  });
});

app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`));
