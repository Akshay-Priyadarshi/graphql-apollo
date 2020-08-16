const { ApolloError } = require("apollo-server-express");

module.exports.AuthError = new ApolloError(
  "User is not Authenticated",
  "AUTHENTICATION_ERROR"
);

module.exports.UserNotFoundError = new ApolloError(
  "You aren't registered with us!",
  "USER_NOT_FOUND_ERROR"
);
