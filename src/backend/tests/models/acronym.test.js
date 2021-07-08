const prisma = require('../../database');
const { acronymProvider } = require('../fixtures');

describe('acronym.model', () => {
  beforeAll(async () => { });

  afterEach(async () => {
    await prisma.acronym.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('should create an acronym record', async () => {
    const data = acronymProvider.getRecord();
    const acronym = await prisma.acronym.create({ data });
    expect(acronym).toHaveProperty('id');
    expect(acronym.created_at).toBeTruthy();
  });
});
