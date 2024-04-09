import client from "../../client";
import { protectResolver } from "../../users/users.utils"

export default {
    Mutation: {
        deletePhoto: protectResolver(async (_, { id }, { loggedInUser }) => {
            const photo = await client.photo.findUnique({
                where: {
                    id,
                },
                select: {
                    userId: true,
                },
            });
            if (!photo) {
                return {
                    ok: false,
                    error: "사진이 존재하지 않음",
                };
            } else if (photo.userId !== loggedInUser.id) {
                return {
                    ok: false,
                    error: "인증조건에 부합하지않음",
                };
            } else {
                await client.photo.delete({
                    where: {
                        id,
                        userId: loggedInUser.id,
                    },
                });
                return {
                    ok: true,
                };
            }
        }),
    },
};