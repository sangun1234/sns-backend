import client from "../../client"

//cursor-based pagination
export default {
    Query: {
        seeFollowing: async (_, { userName, lastId }) => {
            const ok = await client.user.findUnique({
                where: {
                    userName,
                },
                select: {
                    id: true,
                },
            });
            if (!ok) {
                return {
                    ok: false,
                    error: "유저를 찾을 수 없음"
                };
            }
            const following = await client.user.findUnique({
                where: { userName }
            }).following({
                take: 5,
                skip: lastId ? 1 : 0,
                ...(lastId && { cursor: { id: lastId } }),
            });
            return {
                ok: true,
                following,
            }
        },
    },
}