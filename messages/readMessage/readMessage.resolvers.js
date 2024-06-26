import client from "../../client";
import { protectResolver } from "../../users/users.utils";


export default {
    Mutation: {
        readMessage: protectResolver(async (_, { id }, { loggedInUser }) => {
            const message = client.message.findFirst({
                where: {
                    id,
                    userId: {
                        not: {
                            id: loggedInUser.id,
                        },
                    },
                    room: {
                        users: {
                            some: {
                                id: loggedInUser.id,
                            },
                        },
                    },
                },
                select: {
                    id: true,
                },
            });
            if (!message) {
                return {
                    ok: false,
                    error: "메세지가없음",
                };
            }

            await client.message.update({
                where: {
                    id,
                },
                data: {
                    read: true,
                },
            });
            return {
                ok: true,
            };
        }),
    },
};