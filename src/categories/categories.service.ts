import { Injectable, NotFoundException } from '@nestjs/common';
 import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose'; 
  import { Category, CategoryDocument } from './schemas/category.schema';


// categories.service.ts
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

  // ----------- متد جدید برای درخت تا n سطح -----------
  async getCategoryTree(levels: number = 3, onlyActive = true) {
    // گرفتن همه دسته‌ها
    let categories = await this.categoryModel.find().lean();

    // اگر فقط دسته‌های فعال مدنظر است
    if (onlyActive) {
      categories = categories.filter(cat => cat.active);
    }

    // ساخت Map برای دسترسی سریع به فرزندان
    const map = new Map<string | null, any[]>();
    categories.forEach(cat => {
      const parentId = cat.parent ? cat.parent.toString() : null;
      if (!map.has(parentId)) map.set(parentId, []);
      map.get(parentId)!.push(cat);
    });

    // تابع بازگشتی برای ساخت درخت
    const buildTree = (parentId: string | null, level: number) => {
      if (level === 0) return [];
      const nodes = map.get(parentId) || [];
      return nodes.map(node => ({
        ...node,
        children: buildTree(node._id.toString(), level - 1),
      }));
    };

    // شروع از دسته‌های ریشه
    return buildTree(null, levels);
  }
}
