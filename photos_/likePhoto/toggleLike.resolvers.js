import client from "../../client";
import { protectResolver } from "../../users/users.utils";

export default {
    Mutation: {
        toggleLike: protectResolver(async (_, { id }, { loggedInUser }) => {
            const exisitingPhoto = await client.photo.findUnique({
                where: {
                    id,
                },
                include: {
                    likes: true
                },
            });
            console.log(exisitingPhoto);
            if (!exisitingPhoto) {
                return {
                    ok: false,
                    error: "사진을 찾을 수 없음",
                };
            }
            const likeWhere = {
                photoId_userId: {
                    userId: loggedInUser.id,
                    photoId: id,
                },
            };
            const like = await client.like.findUnique({
                where: likeWhere,
            });
            if (like) {
                await client.like.delete({
                    where: likeWhere,
                });
            } else {
                await client.like.create({
                    data: {
                        user: {
                            connect: {
                                id: loggedInUser.id,
                            },
                        },
                        photo: {
                            connect: {
                                id: exisitingPhoto.id,
                            },
                        },
                    }
                })
            }
            return {
                ok: true,
            }
        }),
    },
};