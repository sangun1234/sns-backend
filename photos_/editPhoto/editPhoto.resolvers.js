import JohnMillerOpenAi from "../../JohnMiller";
import SophiaOpenAi from "../../SophiaKimAi";
import client from "../../client";
import openAi from "../../openAI";
import { protectResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";



export default {
    Mutation: {
        editPhoto: protectResolver(async (_, { id, caption }, { loggedInUser }) => {
            const oldPhoto = await client.photo.findFirst({
                where: {
                    id,
                    userId: loggedInUser.id,
                },
                include: {
                    hashtags: {
                        select: {
                            hashtag: true,
                        },
                    },
                    comments: true,
                },
            });
            if (!oldPhoto) {
                return {
                    ok: false,
                    error: "사진이 없음",
                };
            }
            const openAiComment = await openAi(caption);
            const SophiaKimComment = await SophiaOpenAi(caption);

            const JohnMillerComment = await JohnMillerOpenAi(caption);

            // console.log(JSON.stringify(oldPhoto, null, 2));

            await client.photo.update({
                where: {
                    id
                },
                data: {
                    caption,
                    hashtags: {
                        disconnect: oldPhoto.hashtags,
                        connectOrCreate: processHashtags(caption),
                    },
                    comments: {
                        create: [{
                            payload: openAiComment,
                            user: {connect: {userName: 'CHAT-GPT'}},
                        },
                        {
                            payload: SophiaKimComment,
                            user: { connect: { userName: 'Sophia_Kim_AI' } },
                        },
                        {
                            payload: JohnMillerComment,
                            user: { connect: { userName: 'John_Miller_AI' } },
                        }
                    ]
                    }
                },
            });
            return {
                ok: true,
            }
        }
        ),
    },

};