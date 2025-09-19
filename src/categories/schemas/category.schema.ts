import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop({ default: true })
  active: boolean;

  @Prop()
  image: string;

  // self reference
  @Prop({ type: Types.ObjectId, ref: 'Category', default: null })
  parent: Types.ObjectId | null;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
