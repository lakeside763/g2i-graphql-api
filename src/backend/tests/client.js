const supertest = require('supertest');
const { app } = require('../server');

const apolloClient = async ({
  token, multipart, multipartQuery, ...params
} = {}) => {
  if (!token) {
    return supertest(app).post('/graphql').set('Accept', 'application/json').send(params);
  }
  return supertest(app).post('/graphql').set('Authorization', `jwt ${token}`).set('Accept', 'application/json')
    .send(params);
};

module.exports = apolloClient;
