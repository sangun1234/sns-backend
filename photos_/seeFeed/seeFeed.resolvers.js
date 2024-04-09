import client from "../../client";
import { protectResolver } from "../../users/users.utils";


export default {
    Query: {
        seeFeed: protectResolver((_, { lastId }, { loggedInUser }) => {
            return client.photo.findMany({
                where: {
                    OR: [
                        {
                            user: {
                                followers: {
                                    some: {
                                        id: loggedInUser.id,
                                    },
                                },
                            },
                        },
                        {
                            userId: loggedInUser.id,
                        }
                    ]
                },
                orderBy: {
                    createAt: "desc",
                },

                take: 5,
                skip: lastId ? 1 : 0,
                ...(lastId && { cursor: { id: lastId } }),
            });
        }),
    },
};