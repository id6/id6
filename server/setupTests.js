require('reflect-metadata');

const os = require('os');

// env
process.env.ID6_URL = 'http://localhost:3001';
process.env.ID6_REDIRECT_URL = 'http://localhost:3030';
process.env.ID6_AUTHORIZATION_SECRET = 'secret';
process.env.ID6_MAIL_HOST = 'localhost';
process.env.ID6_MAIL_PORT = '1025';
process.env.ID6_JWT_SECRET = 'secret';
process.env.ID6_MONGO_URI = 'mongodb://mocked:27017/mocked';
process.env.ID6_USER = 'user';
process.env.ID6_PASSWORD = 'password';
process.env.ID6_DATA_DIR = os.tmpdir();
