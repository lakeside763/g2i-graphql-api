const { AuthenticationError } = require('apollo-server-express');
const { rule, shield } = require('graphql-shield');
const { isEmpty } = require('lodash');

const isAuthenticated = rule()(
  async (root, args, { auth, authErrorMessage }) => {
    if (auth) {
      return !isEmpty(auth.user);
    }
    if (authErrorMessage) {
      return new AuthenticationError(authErrorMessage);
    }
    return false;
  },
);

const permissions = shield(
  {
    Mutation: {
      updateAcronym: isAuthenticated,
    },
  },
);

module.exports = { permissions };
