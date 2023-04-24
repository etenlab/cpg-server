import { Injectable } from '@nestjs/common';
import { File } from '../model/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { nanoid } from 'nanoid';
import { ReadStream } from 'fs';
import { Transform } from 'stream';
import { createHash } from 'crypto';
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

      const hash = createHash('sha256');
      let hashValue: string | null = null;

      const calcHashTr = new Transform({
        transform(chunk, _encoding, callback) {
          hash.update(chunk);
          this.push(chunk);
          callback();
        },
        flush(callback) {
          hashValue = hash.digest('hex') as string;
          callback();
        },
      });

      readStream.pipe(calcHashTr);

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
        Body: calcHashTr,
      };

      const parallelUploads3 = new Upload({
        client: s3Client,
        params: uploadParams,
        queueSize: 40,
        partSize: 1024 * 1024 * 5,
        leavePartsOnError: false,
      });

      await parallelUploads3.done();

      const fileEntity = await this.fileRepository.find({
        where: {
          fileName: fileName,
          fileType: fileType,
          fileSize: fileSize,
          fileHash: hashValue,
        },
      });

      if (fileEntity.length > 0) {
        const deleteParams = {
          Bucket: bucketName,
          Key: fileKey,
        };

        const deleteCommand = new DeleteObjectCommand(deleteParams);

        await s3Client.send(deleteCommand);

        return fileEntity[0];
      }

      const file = this.fileRepository.create({
        fileName,
        fileType,
        fileSize,
        fileUrl: `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`,
        fileHash: hashValue,
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
