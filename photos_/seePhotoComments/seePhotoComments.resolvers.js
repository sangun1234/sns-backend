import client from "../../client";

export default {
    Query: {
        seePhotoComments: (_, { id, page }) => client.comment.findMany({
            where: {
                photoId: id,
            },
            take: 5,
            skip: page ? 1 : 0,

            ...(page && { cursor: { id: lastId } }),

            orderBy: {
                createdAt: "desc",
            },
        }),
    },
};