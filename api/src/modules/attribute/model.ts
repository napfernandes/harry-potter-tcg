import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AttributeDocument = HydratedDocument<AttributeModel>;

export type AttributeValue = string | readonly string[] | object;

@Schema({ autoCreate: false })
export class AttributeModel {
  @Prop()
  key: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  value?: AttributeValue;

  @Prop()
  language: string;
}

export const AttributeSchema = SchemaFactory.createForClass(AttributeModel);
