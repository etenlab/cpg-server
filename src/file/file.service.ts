import { Injectable } from '@nestjs/common';
import { File } from '../model/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { nanoid } from 'nanoid';
import { ReadStream } from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  async uploadFile(
    readStream: ReadStream,
    fileName: string,
    fileType: string,
    fileSize: number,
  ): Promise<File> {
    try {
      const accessKeyId = process.env.AWS_S3_ACCESS_ID;
      const secretAccessKey = process.env.AWS_S3_SECRET_KEY;
      const bucketName = process.env.AWS_S3_BUCKET_NAME;
      const region = process.env.AWS_S3_REGION;
      const fileKey = `${nanoid()}-${fileName}`;

      const s3Client = new S3Client({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });

      const uploadParams = {
        Bucket: bucketName,
        Key: fileKey,
        Body: readStream,
      };

      const parallelUploads3 = new Upload({
        client: s3Client,
        params: uploadParams,
        queueSize: 40,
        partSize: 1024 * 1024 * 5,
        leavePartsOnError: false,
      });

      await parallelUploads3.done();

      const file = this.fileRepository.create({
        fileName,
        fileType,
        fileSize,
        fileUrl: `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`,
      });

      return await this.fileRepository.save(file);
    } catch (err) {
      console.log('File upload failed', err);
    }
  }

  async getAll() {
    return await this.fileRepository.find();
  }

  async findOne(id: number) {
    return await this.fileRepository.findOneBy({
      id,
    });
  }
}
