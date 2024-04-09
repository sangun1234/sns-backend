import { createWriteStream } from "fs";
import client from "../../client";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
import { protectResolver } from "../users.utils";
import { uploadS3 } from "../../shared/shared.utils";

const resolverFn = async (_, {
    firstName,
    lastName,
    userName,
    email,
    password: newPassword,
    bio,
    avatar,
}, { loggedInUser }
) => {
    let avatarUrl = null;
    if (avatar) {
        avatarUrl = await uploadS3(avatar, loggedInUser.id, "avatars")
        //const { filename, createReadStream } = await avatar;
        //const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
        //const readStream = createReadStream();
        //const writeStream = createWriteStream(process.cwd() + "/uploads/" + newFilename);
        //readStream.pipe(writeStream);
        //avatarUrl = `http://localhost:${process.env.PORT}/static/${newFilename}`;
    }
    let uglyPassword = null;
    if (newPassword) {
        uglyPassword = await bcrypt.hash(newPassword, 10);
    }
    const updatedUser = await client.user.update({
        where: {
            id: loggedInUser.id,
        }, data: {
            // ...()머시기 이놈은 ()에 있는게 true 라면 뒤에 있는녀석이 password가 되는거다잉
            //왜냐하면 ...이 중괄호를 지워주는거야. ES6
            firstName, lastName, userName, email, ...(uglyPassword && { password: uglyPassword }), bio,
            ...(avatarUrl && { avatar: avatarUrl }),
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
};

export default {
    Mutation: {
        editProfile: protectResolver(resolverFn),
    },
};