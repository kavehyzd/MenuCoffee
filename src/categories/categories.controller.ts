import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/categories',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async create(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = {
      name: body.name,
      active: body.active !== 'false', // چون توی فرم میاد string
      image: file ? `/uploads/categories/${file.filename}` : undefined,
      parent: body.parent || null,
    };
    return this.categoriesService.create(data);
  }

  @Get()
  async findAll() {
    return this.categoriesService.findAll();
  }
    @Get('tree')
  async getTree() {
    return this.categoriesService.getCategoryTree(3); // 3 سطح
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/categories',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data: any = {
      name: body.name,
      active: body.active !== 'false',
      parent: body.parent || null,
    };
   if (file) data.image = `/uploads/categories/${file.filename}`;


    return this.categoriesService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }

}
