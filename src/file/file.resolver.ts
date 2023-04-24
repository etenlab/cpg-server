import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ObjectType,
  Field,
} from '@nestjs/graphql';
import { FileService } from './file.service';
import { File } from '../model/entities';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

@ObjectType()
export class FileDecoratorsGQL {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  fileName: string;

  @Field(() => Int)
  fileSize: number;

  @Field(() => String)
  fileType: string;

  @Field(() => String)
  fileUrl: string;

  @Field(() => String)
  fileHash: string;
}

@Resolver(() => File)
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  @Mutation(() => FileDecoratorsGQL)
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename: file_name }: FileUpload,
    @Args({ name: 'file_type', type: () => String }) file_type: string,
    @Args({ name: 'file_size', type: () => Int }) file_size: number,
  ): Promise<File> {
    const file = await this.fileService.uploadFile(
      createReadStream(),
      file_name,
      file_type,
      file_size,
    );
    return file;
  }

  @Query(() => [FileDecoratorsGQL], { name: 'fileList' })
  async getAll() {
    return await this.fileService.getAll();
  }

  @Query(() => FileDecoratorsGQL, { name: 'file' })
  async findOne(@Args({ name: 'id', type: () => Int }) id: number) {
    return await this.fileService.findOne(id);
  }
}
