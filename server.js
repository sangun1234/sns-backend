import "dotenv/config";
const express = require('express');
import { ApolloServer, gql } from "apollo-server-express";
//const { ApolloServer, gql } = require("apollo-server");
const { graphqlUploadExpress } = require("graphql-upload");
import schema, { typeDefs, resolvers } from "./schema";
import { getUser, protectResolver } from "./users/users.utils";
const { ApolloServerPluginLandingPageLocalDefault } = require('apollo-server-core');
import logger from "morgan";



async function startServer() {
    const apollo = new ApolloServer({
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
    await apollo.start();

    const app = express();

    app.use(graphqlUploadExpress());
    //logger("tiny")
    app.use("/static", express.static("uploads"));

    apollo.applyMiddleware({ app });

    const PORT = process.env.PORT
    //await new Promise((r) => app.listen({ port: PORT }, r));
    //console.log(`🚀 Server ready at http://localhost:${PORT}${apollo.graphqlPath}`);

    app.listen({ port: PORT }, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}${apollo.graphqlPath}`);
    });
}

startServer();

