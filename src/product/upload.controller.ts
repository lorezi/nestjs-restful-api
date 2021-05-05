import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller()
export class UploadController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }
}
