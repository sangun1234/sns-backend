import client from "../../client";
import { uploadS3 } from "../../shared/shared.utils";
import { protectResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";

export default {
    Mutation: {
        uploadPhoto: protectResolver(async (_, { file, caption }, { loggedInUser }) => {
            let hashtagObj = [];
            if (caption) {
                //캡션 파징하기(해시태그검출)
                //regular Expression사용
                hashtagObj = processHashtags(caption);
            }

            const fileUrl = await uploadS3(file, loggedInUser.id, "uploads");

            return client.photo.create({
                data: {
                    file: fileUrl,
                    caption,
                    user: {
                        connect: {
                            id: loggedInUser.id,
                        },
                    },
                    ...(hashtagObj.length > 0 &&
                    {
                        hashtags: {
                            connectOrCreate: hashtagObj,
                        },
                    }),
                },
            });
        },
        ),
    },
};