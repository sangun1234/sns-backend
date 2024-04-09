import client from "../../client";
import { protectResolver } from "../../users/users.utils";

export default {


    Mutation: {
        editComment: protectResolver(async (_, { id, payload }, { loggedInUser }) => {
            const comment = await client.comment.findUnique({
                where: {
                    id,
                },
                select: {
                    userId: true,
                },
            });
            if (!comment) {
                return {
                    ok: false,
                    error: "댓글이 존재하지 않음",
                };
            } else if (comment.userId !== loggedInUser.id) {
                return {
                    ok: false,
                    error: "권한이없음",
                };
            } else {
                await client.comment.update({
                    where: {
                        id,
                    },
                    data: {
                        payload,
                    },
                });

                return {
                    ok: true,
                };
            }
        })
    }
};