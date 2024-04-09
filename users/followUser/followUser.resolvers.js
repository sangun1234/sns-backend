import client from "../../client";
import { protectResolver } from "../users.utils";


export default {
    Mutation: {
        followUser: protectResolver(async (_, { userName }, { loggedInUser }) => {
            const ok = await client.user.findUnique({ where: { userName } });
            if (!ok) {
                return {
                    ok: false,
                    error: "유저가 존재하지 않습니다.",
                };
            }
            await client.user.update({
                where: {
                    id: loggedInUser.id,
                },
                data: {
                    following: {
                        connect: {
                            userName,
                        },
                    },
                },
            });
            return {
                ok: true,
            }
        }
        ),
    },
};