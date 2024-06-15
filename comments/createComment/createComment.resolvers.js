import client from "../../client";
import { protectResolver } from "../../users/users.utils";

export default {
    Mutation: {
        createComment: protectResolver(async (_, { photoId, payload }, { loggedInUser }) => {
            const ok = await client.photo.findUnique({
                where: {
                    id: photoId,
                },
                select: {
                    id: true,
                },
            });
            if (!ok) {
                return {
                    ok: false,
                    error: "사진을 찾을 수 없음",
                };
            }
            const newComment = await client.comment.create({
                data: {
                    payload,
                    photo: {
                        connect: {
                            id: photoId,
                        }
                    },
                    user: {
                        connect: {
                            id: loggedInUser.id,
                        },
                    },
                },
            });
            return {
                ok: true,
                id: newComment.id,
            }
        }),
    },
};