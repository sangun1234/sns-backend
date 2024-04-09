import { gql } from "apollo-server";


export default gql`
    type Photo {
        id: Int!
        user: User
        file: String!
        caption: String
        hashtags: [Hashtag]
        createAt: String!
        totalComments: Int!
        updateAt: String!
        likes: [Like]
        likesNumber: Int!
        isMine:Boolean!
    }

    type Hashtag{
        id: Int!
        createAt: String!
        updateAt: String!
        totalPhotos: Int!
        hashtag: String!
        photos(page:Int!): [Photo]
    }

    type Like {
        id: Int!
        photo: Photo!
        user: User!
        createAt: String!
        updateAt: String!
    }
`;