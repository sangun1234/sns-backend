import client from "../../client";
import { NEW_MESSAGE } from "../../constrants";
import pubsub from "../../pubsub";
import { withFilter } from 'graphql-subscriptions';

export default {
    Subscription: {
        roomUpdates: {
            subscribe:
                async (root, args, context, info) => {
                    const room = await client.room.findFirst({
                        where: {
                            id: args.id,
                            users: {
                                some: {
                                    id: context.loggedInUser.id,
                                },
                            },
                        },
                        select: {
                            id: true,
                        },
                    });
                    if (!room) {
                        throw new Error("넌이걸못봐");
                    }

                    return withFilter(() => pubsub.asyncIterator([NEW_MESSAGE]),
                        async (payload, { id }, { loggedInUser }) => {
                            if (payload.roomUpdates.roomId === id) {
                                const room = await client.room.findFirst({
                                    where: {
                                        id,
                                        users: {
                                            some: {
                                                id: loggedInUser.id,
                                            },
                                        },
                                    },
                                    select: {
                                        id: true,
                                    },
                                });
                                if (!room) {
                                    return false;
                                }
                                return true;
                            };
                        }

                    )(root, args, context, info);
                },

        },
    },
};