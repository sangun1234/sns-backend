import client from "../client";

export default {
    User: {
        totalFollowing: ({ id }) =>
            client.user.count({
                where: {
                    followers: {
                        some: {
                            id
                        }
                    },
                },
            }),
        totalFollowers: ({ id }) => client.user.count({
            where: {
                following: {
                    some: {
                        id
                    }
                },
            },
        }),

        isMe: ({ id }, _, { loggedInUser }) => {
            if (!loggedInUser) {
                return false;
            }
            return id === loggedInUser.id;
        },

        isFollowing: async ({ id }, _, { loggedInUser }) => {
            if (!loggedInUser) {
                return false
            }
            const exists = await client.user.findUnique({
                where: { userName: loggedInUser.userName }
            }).following({
                where: {
                    id,
                }
            });

            return exists.length !== 0;
        },

        photos: ({ id }) => client.user.findUnique({
            where: {
                id,
            },
        }).photos(),
    },
};


/* 
root.following.length;을쓰면 되지않나? 
싶었는데 만약 팔로우/팔로잉이 엄청 많다면
이 많은 데이터를 로딩하고싶지않아서
*/