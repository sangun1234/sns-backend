import client from "../../client"
import bcrypt, { hash } from "bcrypt"

export default {
    Mutation: {
        createAccount: async (_, {
            firstName,
            lastName,
            userName,
            email,
            password,
        }) => {
            try {
                // 이메일이나 유저네임이 같은지 확인한다.
                const existingUser = await client.user.findFirst({
                    where: {
                        OR: [
                            {
                                userName,
                            },
                            {
                                email,
                            },
                        ],
                    },
                });

                if (existingUser) {
                    throw new Error("이미 사용중인 아이디입니다.");
                }
                const uglyPassword = await bcrypt.hash(password, 10);
                const createUser = await client.user.create({
                    data: {
                        userName, email, firstName, lastName, password: uglyPassword,
                    },
                });
                // 만약 없다면 비밀번호를 해쉬화 한다.
                // 그후 저장하고 user을 리턴시킨다. \

                return {
                    ok: true,
                    error: null,
                }

            } catch (e) {
                return {
                    ok: false,
                    error: e,
                }

            }
        },
    },
};