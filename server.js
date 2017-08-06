const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema.js');

const app = express();

const PORT = 4000;

app.use('/graphql', expressGraphQL({
  schema: schema,
  graphiql: true
}));

app.listen(PORT, ()=> {
  console.log("Server is running on port " + PORT + "...");
})
