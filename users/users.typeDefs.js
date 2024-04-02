import { gql } from "apollo-server";

export default gql`
    type User {
        id: String!
        firstName:String!
        lastName:String
        userName:String!
        email:String!
        createAt: String!
        updateAt: String!
    }

    type LoginResult{
        ok:Boolean!
        token: String
        error: String
    }

    type Mutation {
        createAccount(
            firstName:String!
            lastName:String
            userName:String!
            email:String!
            password:String!
        ) : User
        login(
            email:String!, password:String!
        ) : LoginResult!
    }

    type Query {
        seeProfile(userName:String): User
    }
`;

