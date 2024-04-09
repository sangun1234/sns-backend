import client from "../../client";
import { protectResolver } from "../../users/users.utils";

export default {
    Mutation: {
        deleteComment: protectResolver(async (_, { id }, { loggedInUser }) => {
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
                    error: "댓글이없음",
                };
            } else if (comment.userId !== loggedInUser.id) {
                console.log(loggedInUser.id);
                return {
                    ok: false,
                    error: "권한이 없음",
                };
            } else {
                await client.comment.delete({
                    where: {
                        id,
                    },
                });
                return {
                    ok: true,
                };
            }
        }),
    },
};