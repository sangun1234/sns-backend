import { gql } from "apollo-server-express";


export default gql`
    type Mutation {
        loginWithGoogle( bool: Boolean ) : LoginResult
    }
`;