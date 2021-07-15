module.exports = {
  Query: {
    getAcronyms: async (root, { page }, { dataSources, helpers }) => {
      try {
        const page_sanitized = await helpers.sanitizer.sanitize(page);
        return await dataSources.acronyms.getAcronyms(page_sanitized);
      } catch (error) {
        return error;
      }
    },
    getAcronym: async (root, { acronym }, { dataSources }) => {
      try {
        return await dataSources.acronyms.getAcronym({ acronym });
      } catch (error) {
        return error;
      }
    },
    getAcronymsByCount: async (root, { count }, { dataSources }) => {
      try {
        return await dataSources.acronyms.getAcronymsByCount({ count });
      } catch (error) {
        return error;
      }
    },
  },
  Mutation: {
    createAcronym: async (root, { input }, { dataSources, helpers }) => {
      try {
        const input_sanitized = await helpers.sanitizer.sanitize(input);
        return await dataSources.acronyms.createAcronym(input_sanitized);
      } catch (error) {
        return error;
      }
    },
    updateAcronym: async (root, { input }, { dataSources }) => {
      try {
        return await dataSources.acronyms.updateAcronym(input);
      } catch (error) {
        return error;
      }
    },
  },
};
