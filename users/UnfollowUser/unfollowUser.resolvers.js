import client from "../../client";
import { protectResolver } from "../users.utils";


export default {
    Mutation: {
        UnfollowUser: protectResolver(async (_, { userName }, { loggedInUser }) => {
            const ok = await client.user.findUnique({ where: { userName } });
            if (!ok) {
                return {
                    ok: false,
                    error: "아이디를 찾을 수 없음 .",
                }
            }

            await client.user.update({
                where: {
                    id: loggedInUser.id,
                },
                data: {
                    following: {
                        disconnect: {
                            userName,
                        },
                    },
                },
            });
            return {
                ok: true,
            }
        }),
    },
};