import "dotenv/config";
const express = require('express');
import { ApolloServer, gql } from "apollo-server-express";
//const { ApolloServer, gql } = require("apollo-server");
const { graphqlUploadExpress } = require("graphql-upload");
import schema, { typeDefs, resolvers } from "./schema";
import { getUser, protectResolver } from "./users/users.utils";
const { ApolloServerPluginLandingPageLocalDefault } = require('apollo-server-core');
import logger from "morgan";
import pubsub from "./pubsub";
import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

async function startServer() {


    const app = express();

    app.use(graphqlUploadExpress());
    //logger("tiny")

    app.use("/static", express.static("uploads"));


    const httpServer = createServer(app);

    const wsServer = new WebSocketServer({
        server: httpServer,

        path: "/graphql"
    })
    const serverCleanup = useServer({
        schema,
        context: async ({ connectionParams }, msg, args) => {
            if (connectionParams) {
                return {
                    loggedInUser: await getUser(connectionParams.token),
                }
            }
        },
        onConnect: async ({ connectionParams }) => {
            if (!connectionParams.token) {
                throw new Error("너는 못들어 ~");
            }
        },
        onDisconnect(ctx, code, reason) {
            console.log('Disconnected!');
        },

    }, wsServer);
    const apollo = new ApolloServer({
        resolvers,
        typeDefs,
        context: async ({ req, connectionParams }) => {
            if (req) {
                return {
                    loggedInUser: await getUser(req.headers.token),
                    protectResolver,
                };
            }
        },
        csrfPrevention: true,
        cache: 'bounded',
        plugins: [
            // Proper shutdown for the HTTP server.

            ApolloServerPluginLandingPageLocalDefault({ embed: true }),
            ApolloServerPluginDrainHttpServer({ httpServer }),

            // Proper shutdown for the WebSocket server.
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });
    await apollo.start();

    apollo.applyMiddleware({ app });
    const PORT = process.env.PORT
    //await new Promise((r) => app.listen({ port: PORT }, r));
    //console.log(`🚀 Server ready at http://localhost:${PORT}${apollo.graphqlPath}`);

    httpServer.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}${apollo.graphqlPath}`);
    });
}

startServer();

