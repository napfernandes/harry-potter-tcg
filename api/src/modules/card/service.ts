import mongoose, { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CardModel } from 'src/modules/card/model';
import { BaseService } from 'src/common/base.service';

@Injectable()
export class CardService extends BaseService<CardModel> {
  constructor(
    @InjectModel(CardModel.name) private cardModel: Model<CardModel>,
  ) {
    super(cardModel);
  }

  insertMany(cards: CardModel[]): Promise<CardModel[]> {
    return this.cardModel.insertMany(cards);
  }

  searchCardById(cardId: string): Promise<CardModel> {
    return this.cardModel.findOne({ _id: new mongoose.Types.ObjectId(cardId) });
  }

  buildSearchCriteria(input?: Partial<CardModel>): Record<string, any> {
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
}
