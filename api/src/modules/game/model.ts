import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type GameDocument = HydratedDocument<GameModel>;

@Schema({ collection: 'games', versionKey: false })
export class GameModel {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    _id: true,
  })
  _id?: string;

  @Prop()
  name: string;

  @Prop()
  code: string;

  @Prop()
  description: string;

  @Prop()
  imageUrl: string;

  @Prop()
  numberOfCards?: number;

  @Prop()
  numberOfDecks?: number;
}

export const GameSchema = SchemaFactory.createForClass(GameModel);
