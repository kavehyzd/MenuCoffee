import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(data: Partial<Category>): Promise<Category> {
    const newCategory = new this.categoryModel(data);
    return newCategory.save();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().populate('parent').exec();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).populate('parent');
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    const category = await this.categoryModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async remove(id: string): Promise<void> {
    const result = await this.categoryModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Category not found');
  }
}
