import { S3Client } from '@aws-sdk/client-s3';

import { Upload } from '@aws-sdk/lib-storage';

const s3 = new S3Client({
    region: "ap-northeast-2",
    credentials: {
        accessKeyId: process.env.AWS_KEY + '',
        secretAccessKey: process.env.AWS_SECRET + '',
    },
});

export const uploadS3 = async (file, userId, folderName) => {
    const { filename, createReadStream } = await file;
    const readStream = createReadStream();
    const newFileName = `${folderName}/${userId}-${Date.now()}-${filename}`;
    let response;

    const uploadData = new Upload({
        client: s3,
        params: {
            Bucket: "sns-uploadss",
            Key: newFileName,
            ACL: "public-read",
            Body: readStream,
        }
    })

    try {
        response = await uploadData.done();
    } catch (e) {
        console.log(e);
    }

    return response.Location;
};