import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GameService } from './service';
import { CardModule } from '../card/module';
import { GamesController } from './controller';
import { GameModel, GameSchema } from './model';

@Module({
  imports: [
    CardModule,
    MongooseModule.forFeature([{ name: GameModel.name, schema: GameSchema }]),
  ],
  controllers: [GamesController],
  providers: [GameService],
  exports: [
    GameService,
    MongooseModule.forFeature([{ name: GameModel.name, schema: GameSchema }]),
  ],
})
export class GameModule {}
