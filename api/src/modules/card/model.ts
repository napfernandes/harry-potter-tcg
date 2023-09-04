import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { AttributeModel } from '../attribute/model';

export type CardDocument = HydratedDocument<CardModel>;

@Schema({ collection: 'cards', versionKey: false })
export class CardModel {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    _id: true,
  })
  _id?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  gameId?: string;

  @Prop()
  attributes?: AttributeModel[];
}

export const CardSchema = SchemaFactory.createForClass(CardModel);
