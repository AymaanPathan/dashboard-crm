import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadToS3 = async (
  buffer: Buffer,
  bucketName: string,
  key: string,
  contentType: string
) => {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: "public-read", // or private
  };

  const uploadResult = await s3.upload(params).promise();
  return uploadResult.Location; // S3 URL
};
