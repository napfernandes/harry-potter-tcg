import mongoose, { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { GameModel } from './model';

@Injectable()
export class GameService {
  constructor(@InjectModel(GameModel.name) private model: Model<GameModel>) {}

  insert(game: GameModel): Promise<GameModel> {
    return new this.model({
      ...game,
      _id: game._id ?? new mongoose.Types.ObjectId(),
    }).save();
  }

  updateGameById(gameId: string, game: Partial<GameModel>): Promise<GameModel> {
    return this.model.findOneAndUpdate({ _id: gameId }, game);
  }

  incrementNumberOfCardsById(
    gameId: string,
    numberOfCards: number,
  ): Promise<GameModel> {
    return this.model.findByIdAndUpdate(gameId, { $inc: { numberOfCards } });
  }

  insertMany(games: GameModel[]): Promise<GameModel[]> {
    return this.model.insertMany(games);
  }

  searchGameById(gameId: string): Promise<GameModel> {
    return this.model.findOne({ _id: new mongoose.Types.ObjectId(gameId) });
  }

  searchGames(): Promise<GameModel[]> {
    return this.model.find({});
  }
}
