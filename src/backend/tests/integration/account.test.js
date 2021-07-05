const prisma = require('../../database');
const apolloClient = require('../client');
const { userProvider } = require('../fixtures');
const { createUserMutation, loginMutation } = require('../queries');

describe('account.integration', () => {
  beforeAll(() => {});

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(() => {});

  test('should create user', async () => {
    const input = userProvider.getRecord();
    const { statusCode, body: { data: { createUser } } } = await apolloClient({
      query: createUserMutation,
      variables: { input },
    });
    expect(statusCode).toBe(200);
    expect(createUser).toHaveProperty('email', input.email);
  });

  test('should allow user to login', async () => {
    const input = userProvider.getRecord();
    await apolloClient({ query: createUserMutation, variables: { input } });
    const { statusCode, body: { data: { login } } } = await apolloClient({
      query: loginMutation,
      variables: { input },
    });
    expect(statusCode).toBe(200);
    expect(login).toHaveProperty('token');
    expect(login).toHaveProperty('user.email', input.email);
  });
});
