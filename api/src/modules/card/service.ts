import mongoose, { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CardModel } from './model';

@Injectable()
export class CardService {
  constructor(
    @InjectModel(CardModel.name) private cardModel: Model<CardModel>,
  ) {}

  insertMany(cards: CardModel[]): Promise<CardModel[]> {
    return this.cardModel.insertMany(cards);
  }

  searchCardById(cardId: string): Promise<CardModel> {
    return this.cardModel.findOne({ _id: new mongoose.Types.ObjectId(cardId) });
  }

  private buildCardSearch(input?: CardModel): Record<string, any> {
    const query: Record<string, any> = {};

    if (!input) {
      return query;
    }

    if (input._id) {
      query._id = new mongoose.Types.ObjectId(input._id);
    }

    if (input.attributes && input.attributes.length) {
      query.attributes = {
        $all: input.attributes.map((attribute) => {
          const attributeQuery = {
            key: attribute.key,
            value: new RegExp(attribute.value.toString(), 'gi'),
          };

          if (attribute.language) {
            attributeQuery['language'] = attribute.language;
          }

          return { $elemMatch: attributeQuery };
        }),
      };
    }

    return query;
  }

  async searchCards(input?: CardModel): Promise<CardModel[]> {
    const query = this.buildCardSearch(input);

    return this.cardModel.where(query);
  }
}
