import client from "../../client";

//offset pagination
//보여줄 데이터가 적거나 게시물 페이지를 통해 이동하려고 할때 적합
export default {
    Query: {
        seeFollowers: async (_, { userName, page }) => {
            const ok = await client.user.findUnique({
                where: {
                    userName,
                },
                select: { id: true },
            });
            console.log(ok);
            if (!ok) {
                return {
                    ok: false,
                    error: "유저를 찾을 수 없음",
                };
            }
            const followers = await client.user.findUnique({ where: { userName } })
                .followers({
                    take: 5,
                    skip: (page - 1) * 5,
                });

            const totalFollowers = await client.user.count({
                where: { following: { some: { userName } } },
            });
            return {
                ok: true,
                followers,
                totalPages: Math.ceil(totalFollowers / 5),
                //반올림 해주는 함수
            };

        },
    },
};