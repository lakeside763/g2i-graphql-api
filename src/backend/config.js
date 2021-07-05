module.exports = {
  port: process.env.PORT || 4000,
  ttlInSeconds: process.env.CACHE_TTL || 0,
  apollo: {
    apikey: process.env.APOLLO_KEY,
    variant: process.env.APOLLO_GRAPH_VARIANT,
    tracing: /^true$/i.test(process.env.ENABLE_GRAPHQL_TRACING),
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS,
    db: process.env.REDIS_DB,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    audience: process.env.JWT_AUD,
    issuer: process.env.JWT_ISS,
    expiresIn: process.env.JWT_EXP || '30d',
  },
};
