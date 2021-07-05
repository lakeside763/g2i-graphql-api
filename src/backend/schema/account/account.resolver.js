const { AuthenticationError } = require('apollo-server-express');

module.exports = {
  Mutation: {
    createUser: async (root, { input }, { dataSources }) => {
      try {
        return await dataSources.accounts.createUser(input);
      } catch (error) {
        return error;
      }
    },
    login: async (root, { input: { email, password } }, { dataSources }) => {
      try {
        const { message, user } = await dataSources.accounts.getLogin({ email, password });
        if (!user) throw new AuthenticationError(message);
        const token = await dataSources.token.set({ user });
        return { token, user };
      } catch (error) {
        return error;
      }
    },
  },
};
