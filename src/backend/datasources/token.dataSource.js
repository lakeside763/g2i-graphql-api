const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { InMemoryLRUCache } = require('apollo-server-caching');
const RootDataSource = require('./root.datasource');

class TokenDataSource extends RootDataSource {
  constructor({ jwt: { secret, ...jwtOptions } }) {
    super();
    this.secret = secret;
    this.jwtOptions = jwtOptions;
  }

  initialize({ context, cache } = {}) {
    this.context = context;
    this.cache = cache || new InMemoryLRUCache();
  }

  didEcounterError(error) {
    throw error;
  }

  cacheKey(id) {
    return `g2i-${process.env.NODE_ENV}-tokencache-${id}`;
  }

  async set({ user }) {
    const jwtToken = await this.sign(user);
    const decodedToken = await this.verify({ token: jwtToken });
    const key = `${decodedToken.jti}`;
    const ttl = decodedToken.exp - Math.floor(new Date().getTime() / 1000);
    await this.cache.set(this.cacheKey(key), JSON.stringify({ token: decodedToken, user }), { ttl });
    return jwtToken;
  }

  async get({ token }) {
    const auth = await this.cache.get(this.cacheKey(token.jti));
    if (auth) {
      return JSON.parse(auth);
    }
    return null;
  }

  async getAuth({ req }) {
    const jwtToken = await this.getFromHeaders({ req });
    const token = await this.verify({ token: jwtToken });
    return this.get({ token });
  }

  async verify({ token }) {
    const tokenBuffer = Buffer.from(this.secret, 'base64');
    const { audience, issuer } = this.jwtOptions;
    return jwt.verify(token, tokenBuffer, { audience, issuer });
  }

  async delete({ token }) {
    try {
      await this.cache.delete(this.cacheKey(token.jti));
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        console.error(`Could not delete cache key: ${this.cacheKey(token.jti)}`); // eslint-disable-line no-console
        console.error(error); // eslint-disable-line no-console
      }
    }
    return true;
  }

  async sign({ id, overrides = {} }) {
    const jwtid = uuidv4();
    const subject = id.toString();
    const options = {
      ...this.jwtOptions, subject, jwtid, ...overrides,
    };
    const tokenBuffer = Buffer.from(this.secret, 'base64');
    return jwt.sign({}, tokenBuffer, options);
  }

  async decode({ token }) {
    const tokenBuffer = Buffer.from(this.secret, 'base64');
    const { audience, issuer } = this.jwtOptions;
    return jwt.decode(token, tokenBuffer, { audience, issuer });
  }

  async getFromHeaders({ req }) {
    if (!req.headers || !req.headers.authorization) {
      throw new Error('No Authorization Header');
    }

    const parts = req.headers.authorization.split(' ');
    if (parts.length !== 2) {
      throw new Error('Invalid Authorization Header');
    }

    const scheme = parts[0];
    if (!/^jwt$/i.test(scheme)) {
      throw new Error('Invalid Authorization Scheme');
    }
    return parts[1];
  }
}

module.exports = TokenDataSource;
