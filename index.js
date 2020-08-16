const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./schema");
const mongoose = require("mongoose");
require("dotenv").config();
const PORT = process.env.PORT || 4000;

const app = express();
mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1zl3y.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
mongoose.connection.once("open", () => {
  console.log("Conneted to database");
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  debug: process.env.NODE_ENV === "development",
});

server.applyMiddleware({ app });

app.listen(PORT, () => {
  console.log(`App listening on localhost:${PORT}${server.graphqlPath}`);
});
