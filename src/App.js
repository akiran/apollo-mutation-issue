import React, { Component } from "react";
import "./App.css";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";

import { ApolloProvider, Query, Mutation, graphql } from "react-apollo";
import { load } from "protobufjs";
import { runInThisContext } from "vm";

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
    client
      .mutate({
        mutation: mutationQuery,
        variables: { name: e.target.value }
      })
      .then(res => {
        console.log("mutaiton res", res);
      });
  }
  render() {
    const { user, loading } = this.props.data;
    if (loading) {
      return null;
    }
    return (
      <div>
        {user.name}
        <input
          placeholder="name"
          value={user.name}
          onChange={this.changeHandler}
        />
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
          {/* <NameInput /> */}
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
