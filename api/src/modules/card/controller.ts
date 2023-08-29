import { Body, Controller, Get, Param } from '@nestjs/common';

import { CardModel } from './model';
import { CardService } from './service';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardService: CardService) {}

  @Get('/')
  searchCards(@Body() input: CardModel): Promise<CardModel[]> {
    return this.cardService.searchCards(input);
  }

  @Get('/:cardId')
  searchCardById(@Param('cardId') cardId: string): Promise<CardModel> {
    return this.cardService.searchCardById(cardId);
  }
}
