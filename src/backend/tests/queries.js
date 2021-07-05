const acronymFragments = `
  fragment acronymFields on Acronym {
    id
    acronym
    meaning
    created_at
    updated_at
  }
`;

const userFragments = `
  fragment userFields on User {
    id
    email
    created_at
    updated_at
  }
`;

const createAcronymMutation = `
  mutation CreateAcronym($input: CreateAcronymInput!) {
    createAcronym(input: $input) {
      ...acronymFields
    }
  }
  ${acronymFragments}
`;

const getAcronymQuery = `
  query GetAcronym($acronym: String!) {
    getAcronym(acronym: $acronym) {
      ...acronymFields
    }
  }
  ${acronymFragments}
`;

const createUserMutation = `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      ...userFields
    }
  }
  ${userFragments}
`;

const loginMutation = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        ...userFields
      }
    }
  }
  ${userFragments}
`;

const updateAcronymMutation = `
  mutation updateAcronym($input: UpdateAcronymInput!) {
    updateAcronym(input: $input) {
      ...acronymFields
    }
  }
  ${acronymFragments}
`;

module.exports = {
  createAcronymMutation,
  getAcronymQuery,
  createUserMutation,
  loginMutation,
  updateAcronymMutation,
};
