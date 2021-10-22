const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const fs = require('fs'); 
const { signUp, logIn, updateUser, deleteUser} = require('./service')


// Construct a schema, using GraphQL schema language
const buildSchemaQuery = fs.readFileSync('./schema.gql','utf-8');
const schema = buildSchema(buildSchemaQuery);

// The root provides a resolver function for each API endpoint
const root = {
  signUp: (user) => signUp(user),
  logIn: (credentials) => logIn(credentials),
  updateUser: (updatedUser) => updateUser(updatedUser),
  deleteUser: ({ id }) => deleteUser(id)
};

const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');