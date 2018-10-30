import React, { Component } from "react";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";

import { ApolloProvider, graphql } from "react-apollo";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql"
});

const userQuery = gql`
  {
    user {
      id
      name
    }
  }
`;

const mutationQuery = gql`
  mutation updateMutation($name: String) {
    updateName(name: $name) {
      id
      name
    }
  }
`;

class Name extends React.Component {
  changeHandler(e) {
    client.mutate({
      mutation: mutationQuery,
      variables: { name: e.target.value },
      optimisticResponse: {
        __typename: "Mutation",
        updateName: {
          __typename: "User",
          id: 1,
          name: e.target.value
        }
      },
      update: (cache, { data }) => {
        console.log("mutation update", data);
      }
    });
  }
  render() {
    const { user, loading } = this.props.data;
    if (loading) {
      return null;
    }
    return (
      <div>
        <div style={{ height: 20 }}>{user.name}</div>
        <div>
          <input
            placeholder="name"
            value={user.name}
            onChange={this.changeHandler}
          />
        </div>
      </div>
    );
  }
}

const NameContainer = graphql(userQuery)(Name);

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <div>Hello</div>
          <NameContainer />
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
