import jwt from "jsonwebtoken";
import client from "../../client"
import bcrypt, { hash } from "bcrypt"

export default {
    Mutation: {
        login: async (_, { email, password }) => {
            // 이메일과 일치하는 유저를 찾는다.
            const user = await client.user.findFirst({
                where: {
                    email
                }
            });

            if (!user) {
                return {
                    ok: false,
                    error: "유저를 찾지 못함",
                };
            }
            // 패스워드와 입력된 패스워드가 일치하는지 찾는다.
            const passwordOk = await bcrypt.compare(password, user.password);
            if (!passwordOk) {
                return {
                    ok: false,
                    error: "올바르지 않은 비밀번호",
                };
            }
            // 둘다 일치하면 토큰을 발행해서 유저한테 리턴한다.
            const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);

            return {
                ok: true,
                token: token,
            }
        },
    },
};