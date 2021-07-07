const prisma = require('../../database');
const apolloClient = require('../client');
const { acronymProvider, userProvider } = require('../fixtures');
const {
  createAcronymMutation,
  getAcronymQuery,
  createUserMutation,
  loginMutation,
  updateAcronymMutation,
} = require('../queries');

describe('sanity check', () => {
  beforeAll(() => {});

  afterEach(async () => {
    await prisma.acronym.deleteMany();
  });

  afterAll(() => {});

  const loginFn = async () => {
    const input = userProvider.getRecord();
    await apolloClient({ query: createUserMutation, variables: { input } });
    const { body: { data: { login: loginData } } } = await apolloClient({
      query: loginMutation,
      variables: { input },
    });
    return { loginData };
  };

  test('should create acronym', async () => {
    const input = acronymProvider.getRecord();
    const { statusCode, body: { data: { createAcronym } } } = await apolloClient({
      query: createAcronymMutation,
      variables: { input },
    });
    expect(statusCode).toBe(200);
    expect(createAcronym).toHaveProperty('id');
    expect(createAcronym).toHaveProperty('acronym');
    expect(input).toHaveProperty('acronym');
  });

  test('should fetch a record of acronym', async () => {
    const input = acronymProvider.getRecord();
    const { body: { data: { createAcronym: { acronym } } } } = await apolloClient({
      query: createAcronymMutation,
      variables: { input },
    });
    const { statusCode, body: { data: { getAcronym } } } = await apolloClient({
      query: getAcronymQuery,
      variables: { acronym },
    });
    expect(statusCode).toBe(200);
    expect(getAcronym).toHaveProperty('acronym', acronym);
  });

  test('should update acronym record', async () => {
    const { loginData: { token } } = await loginFn();
    const input = acronymProvider.getRecord();
    const { body: { data: { createAcronym: { id, acronym, meaning } } } } = await apolloClient({
      query: createAcronymMutation,
      variables: { input },
    });
    const updateInput = { id, meaning: `${acronym} ${meaning}` };
    const { statusCode, body: { data: { updateAcronym } } } = await apolloClient({
      token,
      query: updateAcronymMutation,
      variables: { input: updateInput },
    });
    expect(statusCode).toBe(200);
    expect(updateAcronym).toHaveProperty('acronym');
    expect(updateAcronym).toHaveProperty('meaning', updateInput.meaning);
  });
});
