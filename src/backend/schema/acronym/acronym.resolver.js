module.exports = {
  Query: {
    getAcronyms: async (root, { page }, { dataSources }) => {
      try {
        return await dataSources.acronyms.getAcronyms(page);
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
    createAcronym: async (root, { input }, { dataSources }) => {
      try {
        return await dataSources.acronyms.createAcronym(input);
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
