import "dotenv/config";
import { ApolloServer, gql } from "apollo-server";
//const { ApolloServer, gql } = require("apollo-server");
import schema from "./schema";





const server = new ApolloServer({
    schema,
});

const PORT = process.env.PORT

server.listen(PORT).then(() => console.log(`Server is running on http://localhost:${PORT}`))