import client from "../client";

export default {
    Room: {
        users: ({ id }) => client.room.findUnique({ where: { id } }).users(),
        messages: ({ id }) => client.message.findMany({
            where: {
                roomId: id,
            },
        }),
        unreadTotal: ({ id }, _, { loggedInUser }) => {
            if (!loggedInUser) {
                return 0;
            }
            return client.message.count({
                where: {
                    read: false,
                    roomId: id,
                    user: {
                        id: {
                            not: loggedInUser.id,
                        },
                    },
                    //이거 대신 userId : { not : loggedInUser.id} 이걸 쓰면 안되나 ?
                },
            });
        },
    },
    Message: {
        user: ({ id }) => client.message.findUnique({ where: { id } }).user(),
    },
};