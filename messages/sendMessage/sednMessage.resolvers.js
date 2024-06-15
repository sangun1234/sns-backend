import client from "../../client";
import { NEW_MESSAGE } from "../../constrants";
import pubsub from "../../pubsub";
import { protectResolver } from "../../users/users.utils";


export default {
    Mutation: {
        sendMessage: protectResolver(async (_, { payload, roomId, userId }, { loggedInUser }) => {
            let room = null;
            if (userId) {
                const user = await client.user.findUnique({
                    where: {
                        id: userId,
                    },
                    select: {
                        id: true,
                    },
                });
                if (!user) {
                    return {
                        ok: false,
                        error: "유저가 존재하지않음",
                    };
                }
                room = await client.room.create({
                    data: {
                        users: {
                            connect: [
                                {
                                    id: userId
                                },
                                {
                                    id: loggedInUser.id,
                                },
                            ],
                        },
                    },
                });
            }

            else if (roomId) {
                room = await client.room.findUnique({
                    where: {
                        id: roomId,
                    },
                    select: {
                        id: true,
                    },
                });

                if (!room) {
                    return {
                        ok: false,
                        error: "대화방이 존재하지않음",
                    };
                }

            }
            const message = await client.message.create({
                data: {
                    payload,
                    room: {
                        connect: {
                            id: room.id,
                        },
                    },
                    user: {
                        connect: {
                            id: loggedInUser.id,
                        },
                    },
                },
            });
            pubsub.publish(NEW_MESSAGE, {
                roomUpdates: {
                    ...message
                }
            });
            return {
                // 여기 message의 id를 줘야되는데 어떻게 받아오지?
                id: message.id,
                ok: true,
            };
        }),
    },
};