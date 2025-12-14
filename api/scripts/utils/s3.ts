import {
  GetObjectCommand,
  PutObjectCommand,
  NoSuchKey,
  S3Client,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import logger from "./logger";

const bucketName = process.env.S3_BUCKET_NAME;

export async function getSubtitlesFromS3Bucket(videoId: string, durationSec: number) {
  const client = new S3Client({ region: "eu-central-1" });

  try {
    const response = await client.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: `subtitles/youtube/${videoId}-${durationSec}-youtube.srt`,
      })
    );
    const subtitleStr = await response.Body.transformToString();
    logger.debug(`Got subtitle for ${videoId} from S3 bucket`);
    return subtitleStr;
  } catch (caught) {
    if (caught instanceof NoSuchKey) {
      logger.debug(`Subtitle for ${videoId} not found in S3 bucket`);
    } else if (caught instanceof S3ServiceException) {
      logger.error(
        `Error from S3 while getting subtitles for ${videoId}.  ${caught.name}: ${caught.message}`
      );
    } else {
      throw caught;
    }
  }
  return null;
}

export async function uploadSubtitlesToS3Bucket(
  videoId: string,
  durationSec: number,
  subtitlesSRTString: string
) {
  const client = new S3Client({ region: "eu-central-1" });
  const key = `subtitles/youtube/${videoId}-${durationSec}-youtube.srt`;
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: subtitlesSRTString,
  });
  logger.debug(`Uploading subtitles for video ${videoId} to S3 bucket`);

  try {
    const response = await client.send(command);
    logger.debug(response);
  } catch (caught) {
    if (caught instanceof S3ServiceException && caught.name === "EntityTooLarge") {
      logger.error(
        `Error from S3 while uploading object to ${bucketName} with key ${key}. \
The object was too large. To upload objects larger than 5GB, use the S3 console (160GB max) \
or the multipart upload API (5TB max).`
      );
    } else if (caught instanceof S3ServiceException) {
      logger.error(
        `Error from S3 while uploading object to ${bucketName} with key ${key}.  ${caught.name}: ${caught.message}`
      );
    } else {
      throw caught;
    }
  }
}
