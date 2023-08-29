import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CardService } from './service';
import { CardsController } from './controller';
import { CardModel, CardSchema } from './model';
import { AttributeModule } from '../attribute/module';

@Module({
  imports: [
    AttributeModule,
    MongooseModule.forFeature([{ name: CardModel.name, schema: CardSchema }]),
  ],
  controllers: [CardsController],
  providers: [CardService],
  exports: [
    CardService,
    MongooseModule.forFeature([{ name: CardModel.name, schema: CardSchema }]),
  ],
})
export class CardModule {}
