import { Controller, Get, Param } from '@nestjs/common';

import { CardModel } from 'src/modules/card/model';
import { GameModel } from 'src/modules/game/model';
import { SearchResult } from 'src/common/interface';
import { CardService } from 'src/modules/card/service';
import { GameService } from 'src/modules/game/service';

@Controller('games')
export class GamesController {
  constructor(
    private readonly gameService: GameService,
    private readonly cardService: CardService,
  ) {}

  @Get('/')
  searchGames(): Promise<GameModel[]> {
    return this.gameService.searchGames();
  }

  @Get('/:gameId')
  searchGameById(@Param('gameId') gameId: string): Promise<GameModel> {
    return this.gameService.searchGameById(gameId);
  }

  @Get('/:gameId/cards')
  searchCardsByGameId(
    @Param('gameId') gameId: string,
  ): Promise<SearchResult<CardModel>> {
    return this.cardService.searchAll({
      filters: { gameId },
      skipPagination: true,
    });
  }
}
