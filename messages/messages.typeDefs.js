import { gql } from "apollo-server";


export default gql`
    type Message {
        id: Int!
        payload: String!
        user: User!
        room: Room!
        createAt: String!
        updateAt: String!
        read: Boolean!
    }

    type Room {
        id: Int!
        users: [User]
        unreadTotal: Int!
        messages: [Message]
        createAt: String!
        updateAt: String!
    }
`;