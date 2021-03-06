const _ = require('lodash');
const faker = require('faker');

const getRecord = (overides = {}, qty = 1, includeAutoGeneratedFields = false) => {
  const records = _.times(qty, () => {
    const {
      acronym = faker.lorem.word(),
      meaning = faker.lorem.words(),
      created_at = new Date(),
      updated_at = new Date(),

    } = overides;

    const fields = {
      acronym,
      meaning,
    };

    const generated = {
      created_at,
      updated_at,
    };

    if (includeAutoGeneratedFields) {
      return _.pickBy({ ...fields, ...generated }, _.identity);
    }

    return _.pickBy({ ...fields }, _.identity);
  });

  if (qty === 1) {
    return records[0];
  }
  return records;
};
module.exports = {
  getRecord,
};
