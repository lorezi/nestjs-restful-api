import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Request, Response } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller()
export class UploadController {
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename(req: Request, file: Express.Multer.File, cb) {
          if (file.mimetype.startsWith('image')) {
            const randomName = `user-${file.originalname}-${Date.now()}`;
            return cb(null, `${randomName}${extname(file.originalname)}`);
          }
          return cb(new BadRequestException('invalid file upload'), '');
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (file.mimetype.startsWith('image')) {
      return {
        url: `http://localhost:8000/api/${file.path}`,
      };
    }

    throw new BadRequestException('invalid file upload');
  }

  @Get('uploads/:path')
  async getImage(@Param('path') path, @Res() res: Response) {
    res.sendFile(path, { root: 'uploads' });
  }
}
