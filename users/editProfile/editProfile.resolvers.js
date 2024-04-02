import client from "../../client"
import bcrypt, { hash } from "bcrypt"

export default {
    Mutation: {
        editProfile: async (_, {
            firstName,
            lastName,
            userName,
            email,
            password: newPassword,
        }) => {
            let uglyPassword = null;
            if (newPassword) {
                uglyPassword = await bcrypt.hash(newPassword, 10);
            }
            const updatedUser = await client.user.update({
                where: {
                    id: 1,
                }, data: {
                    // ...()머시기 이놈은 ()에 있는게 true 라면 뒤에 있는녀석이 password가 되는거다잉
                    //왜냐하면 ...이 중괄호를 지워주는거야. ES6
                    firstName, lastName, userName, email, ...(uglyPassword && { password: uglyPassword }),
                },
            });
            if (updatedUser.id) {
                return {
                    ok: true,
                }
            } else {
                return {
                    ok: false,
                    error: "편집할수가없어요",
                }
            }
        },
    },
};