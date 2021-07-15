const compression = require('compression');
const express = require('express');
const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');
const { RedisCache } = require('apollo-server-cache-redis');
const { applyMiddleware } = require('graphql-middleware');
const indexRouter = require('./routes/index');
const config = require('./config');
const datasources = require('./datasources');
const prisma = require('./database');

const cache = new RedisCache(config.redis);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());

app.use('/', indexRouter);

const { typeDefs, resolvers } = require('./schema');
const { permissions } = require('./permission');

const server = new ApolloServer({
  schema: applyMiddleware(
    makeExecutableSchema({
      typeDefs,
      resolvers,
    }),
    permissions,
  ),
  cache,
  tracing: config.apollo.tracing,
  dataSources: () => ({
    acronyms: new datasources.Acronyms(),
    token: new datasources.Token(config),
    accounts: new datasources.Accounts(),
  }),
  formatError: (err) => {
    if (err.extensions.code !== 'UNAUTHENTICATED' && err.extensions.code !== 'BAD_USER_INPUT') {
      console.error(JSON.stringify(err, null, 2));
    }
    return err;
  },
  context: async ({ req }) => {
    const tokenSource = new datasources.Token(config);
    tokenSource.initialize({ cache });
    let auth = null;
    let authErrorMessage = null;
    try {
      auth = await tokenSource.getAuth({ req });
      if (!auth) {
        authErrorMessage = 'jwt expired';
      }
    } catch (error) {
      authErrorMessage = error.message;
    }

    return {
      prisma,
      auth,
      authErrorMessage,
    };
  },
});

server.applyMiddleware({ app });

const shutdown = async () => {
  // eslint-disable-next-line no-console
  console.info('Received kill signal, shutting down gracefully');
  await prisma.$disconnect();
  return process.exit();
};

module.exports = {
  app,
  server,
  config,
  shutdown,
};
