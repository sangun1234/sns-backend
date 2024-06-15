import client from "../client";


export default {
    Photo: {
        user: ({ userId }) =>
            client.user.findUnique({ where: { id: userId } }),


        hashtags: ({ id }) =>
            client.hashtag.findMany({
                where: {
                    photos: {
                        some: {
                            id,
                        }
                    },
                },
            }),
        likesNumber: (parent) => {
            console.log(parent);

            return client.like.count({
                where: { photoId: parent.id },
            })
        },

        totalComments: ({ id }) => {
            return client.comment.count({
                where: {
                    photoId: id,
                }
            })
        },

        comments: ({id}) => {
            return client.comment.findMany({
                where:{
                    photoId: id,
                },
                include: {
                    user: true,
                }
            })
        },

        isMine: ({ userId }, _, { loggedInUser }) => {
            if (!loggedInUser) {
                return false;
                //loggedInUser가 없을경우엔 아래식만 있으면 에러가 뜨기 때문에 설정
            }
            return userId === loggedInUser.id;
        },

        isLiked:  async({ id }, _, { loggedInUser }) => {
            if (!loggedInUser) {
                return false;
                //loggedInUser가 없을경우엔 아래식만 있으면 에러가 뜨기 때문에 설정
            }
            const ok = await client.like.findUnique({
                where: {
                    photoId_userId: {
                        photoId:id,
                        userId:loggedInUser.id,
                    }
                },
                select: {
                    id:true,
                }
            })
            if(ok) {
                return true;
            }
            return false;
        },
    },

    Hashtag: {
        totalPhotos: ({ id }) => client.photo.count({
            where: {
                hashtags: {
                    some: {
                        id,
                    },
                },
            },
        }),

        photos: ({ id }, args) => {
            console.log(args);
            return client.hashtag.findUnique({
                where: {
                    id,
                },
            }).photos()

        },
    },
};