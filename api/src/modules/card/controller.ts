import { Body, Controller, Get, Param } from '@nestjs/common';

import { CardModel } from 'src/modules/card/model';
import { SearchInput } from 'src/common/interface';
import { SearchResult } from 'src/common/interface';
import { CardService } from 'src/modules/card/service';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardService: CardService) {}

  @Get('/')
  searchCards(
    @Body() input: SearchInput<CardModel>,
  ): Promise<SearchResult<CardModel>> {
    return this.cardService.searchAll(input);
  }

  @Get('/:cardId')
  searchCardById(@Param('cardId') cardId: string): Promise<CardModel> {
    return this.cardService.searchCardById(cardId);
  }
}
