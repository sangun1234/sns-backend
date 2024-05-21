import client from "../../client";
import openAi from "../../openAI";
import { uploadS3 } from "../../shared/shared.utils";
import { protectResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";

export default {
    Mutation: {
        uploadPhoto: protectResolver(async (_, { file, caption }, { loggedInUser }) => {
            let hashtagObj = [];
            const fileUrl = "null";
            //기존에는 파일을 필수로 요구했지만 글을 필수로 바꿨음.
            if (file) {
                //파일 s3에 업로드하기
                fileUrl = await uploadS3(file, loggedInUser.id, "uploads");
            }
            //캡션 파징하기(해시태그검출)
            //regular Expression사용
            hashtagObj = processHashtags(caption);
            //첫 게시물을 업로드했을 때, 첫 댓글이 ai가 달아준 댓글이여야한다.
            const openAiComment = await openAi(caption);
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
                    comments: {
                        create: {
                            payload: openAiComment,
                            user: {connect: {userName: 'CHAT-GPT'}},
                        }
                    },
                },
                include: {
                    comments: true
                } 
            });
        },
        ),
    },
};