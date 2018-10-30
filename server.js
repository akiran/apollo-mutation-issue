const { ApolloServer, gql } = require("apollo-server");

function sleep(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

const typeDefs = gql`
  type User {
    id: Int
    name: String
  }
  type Mutation {
    updateName(name: String): User
  }
  type Query {
    user: User
  }
`;

let user = {
  id: 1,
  name: ""
};

const resolvers = {
  Query: {
    user: () => user
  },
  Mutation: {
    updateName: async (root, args) => {
      await sleep(10000);
      user.name = args.name;
      return user;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
