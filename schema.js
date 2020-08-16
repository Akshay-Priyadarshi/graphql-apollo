const { gql } = require("apollo-server-express");
const { AuthError, UserNotFoundError } = require("./errors/errors");
const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const typeDefs = gql`
  type BookType {
    _id: ID!
    title: String!
    authorId: ID!
    author: AuthorType
  }
  type AuthorType {
    _id: ID!
    name: String!
    age: Int!
    books: [BookType!]!
  }
  type Query {
    books: [BookType!]!
    book(_id: ID!): BookType
    authors: [AuthorType!]!
    author(_id: ID!): AuthorType
  }
  type Mutation {
    addBook(title: String!, authorId: ID!): BookType
    addAuthor(name: String!, age: Int!): AuthorType
    signin(email: String!, password: String!): String!
  }
`;

const resolvers = {
  BookType: {
    author: (parent) => {
      return Author.findById(parent.authorId);
    },
  },
  AuthorType: {
    books: (parent) => {
      return Book.find({ authorId: parent._id });
    },
  },
  Query: {
    books: () => {
      return Book.find({});
    },
    book: (_, args) => {
      return Book.findById(args._id);
    },
    author: (_, args) => {
      return Author.findById(args._id);
    },
    authors: () => {
      return Author.find({});
    },
  },
  Mutation: {
    addBook: (_, args) => {
      const newBook = new Book({
        title: args.title,
        authorId: args.authorId,
      });
      return newBook.save();
    },
    addAuthor: (_, args) => {
      const newAuthor = new Author({
        name: args.name,
        age: args.age,
      });
      return newAuthor.save();
    },
    signin: async (_, { email, password }) => {
      const user = await User.findOne({ email: email, password: password });
      if (user) {
        const token = jwt.sign(user.toObject(), process.env.SECRET_KEY, {
          algorithm: "HS256",
          subject: String(user._id),
          expiresIn: "1d",
        });
        return token;
      } else {
        throw UserNotFoundError;
      }
    },
  },
};

module.exports = { typeDefs, resolvers };
