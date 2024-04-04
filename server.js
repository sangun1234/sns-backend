import "dotenv/config";
const express = require('express');
import { ApolloServer, gql } from "apollo-server-express";
//const { ApolloServer, gql } = require("apollo-server");
const { graphqlUploadExpress } = require("graphql-upload");
import schema, { typeDefs, resolvers } from "./schema";
import { getUser, protectResolver } from "./users/users.utils";
const { ApolloServerPluginLandingPageLocalDefault } = require('apollo-server-core');




async function startServer() {
    const server = new ApolloServer({
        resolvers,
        typeDefs,
        context: async ({ req }) => {
            return {
                loggedInUser: await getUser(req.headers.token),
                protectResolver,
            };
        },
        csrfPrevention: true,
        cache: 'bounded',
        plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
    });
    await server.start();

    const app = express();

    app.use(graphqlUploadExpress());

    server.applyMiddleware({ app });

    const PORT = process.env.PORT
    await new Promise((r) => app.listen({ port: PORT }, r));

    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);

}

startServer();

