import { gql } from "apollo-server-express";



export default gql`
    type Mutation {
        UnfollowUser(userName:String!): MutationResponse
    }
`;