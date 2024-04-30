import { gql } from "apollo-server";

export default gql`
    type User {
        id: Int!
        firstName:String!
        lastName:String
        userName:String!
        email:String!
        createAt: String!
        updateAt: String!
        bio: String
        avatar: String
        photos: [Photo]
        following: [User]
        followers: [User]
        totalFollowing: Int!
        totalFollowers: Int!
        isMe: Boolean!
        isFollowing: Boolean!
        locations: [Location]
    }
`;

//
// isMe: Boolean!