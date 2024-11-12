import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import UserType from "./User.js";
import User from "model/User.js";
import MovieType from "./Movie.js";
import Movie from "model/Movie.js";
import { hashPassword } from "utils/passwordUtils.js";

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    users: {
      type: GraphQLList(UserType),
      resolve: async () => {
        try {
          const users = await User.find();
          return users.map((user) => ({
            ...user.toObject(),
            id: user._id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          }));
        } catch (error) {
          throw new Error(error.message);
        }
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLNonNull(GraphQLString) } },
      resolve: async (_, { id }) => {
        try {
          const user = await User.findById(id);
          return {
            ...user.toObject(),
            id: user._id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          };
        } catch (error) {}
      },
    },
    movies: {
      type: GraphQLList(MovieType),
      resolve: async () => {
        try {
          return await Movie.find();
        } catch (error) {
          throw new Error(error.message);
        }
      },
    },
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLNonNull(GraphQLString) } },
      resolve: async (_, { id }) => {
        try {
          return await Movie.findById(id);
        } catch (error) {
          throw new Error(error.message);
        }
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        email: { type: GraphQLNonNull(GraphQLString) },
        username: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        isAdmin: { type: GraphQLNonNull(GraphQLBoolean) },
      },
      resolve: async (_, { password, ...rest }) => {
        try {
          const hashedPassword = await hashPassword(password);

          const user = new User({
            password: hashedPassword,
            ...rest,
          });

          return await user.save();
        } catch (error) {
          throw new Error(error.message);
        }
      },
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        username: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        isAdmin: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, args) => {
        try {
          return await User.findByIdAndUpdate(args.id, args, { new: true });
        } catch (error) {
          throw new Error(error.message);
        }
      },
    },
    deleteUser: {
      type: UserType,
      args: { id: { type: GraphQLNonNull(GraphQLString) } },
      resolve: async (_, { id }) => {
        try {
          return await User.findByIdAndDelete(id);
        } catch (error) {
          throw new Error(error.message);
        }
      },
    },
    addMovie: {
      type: MovieType,
      args: {
        title: { type: GraphQLNonNull(GraphQLString) },
        genre: { type: GraphQLNonNull(GraphQLString) },
        rating: { type: GraphQLNonNull(GraphQLInt) },
        duration: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, args) => {
        try {
          const movie = new Movie(args);
          return await movie.save();
        } catch (error) {
          throw new Error(error.message);
        }
      },
    },
    updateMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
        title: { type: GraphQLNonNull(GraphQLString) },
        genre: { type: GraphQLNonNull(GraphQLString) },
        rating: { type: GraphQLNonNull(GraphQLInt) },
        duration: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, args) => {
        try {
          return await Movie.findByIdAndUpdate(args.id, args, { new: true });
        } catch (error) {
          throw new Error(error.message);
        }
      },
    },
    deleteMovie: {
      type: MovieType,
      args: { id: { type: GraphQLNonNull(GraphQLString) } },
      resolve: async (_, { id }) => {
        try {
          return await Movie.findByIdAndDelete(id);
        } catch (error) {
          throw new Error(error.message);
        }
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
