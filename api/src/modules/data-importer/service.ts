import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';

import { CardGameName } from './enum';
import { CardModel } from '../card/model';
import { CardService } from '../card/service';
import { GameService } from '../game/service';
import { AttributeModel, AttributeValue } from '../attribute/model';
import { CardFromJsonFile, CardModelForImporting } from './interface';

@Injectable()
export class DataImporterService {
  constructor(
    private readonly cardService: CardService,
    private readonly gameService: GameService,
  ) {}

  async readFromSet(filePath: string): Promise<CardFromJsonFile[]> {
    const result = fs.readFileSync(filePath, { encoding: 'utf-8' });

    if (!result) return [];

    return JSON.parse(result);
  }

  private buildAttribute(
    key: string,
    language: string,
    value?: AttributeValue,
  ): AttributeModel {
    if (!value || !Object.keys(value).length) return undefined;

    return { key, language, value };
  }

  buildCardFromJsonFileToModel(
    gameId: string,
    card: CardFromJsonFile,
  ): CardModelForImporting {
    const language = card.detail.language.code.toLowerCase();
    const cardSubTypes = card.subTypes.map((subType) => subType.subType.name);
    const cardImages = card.images.map((image) => ({
      language: image.language.code.toLowerCase(),
      url: image.url,
    }));

    return {
      gameId,
      tempCardId: card.cardId,
      attributes: [
        this.buildAttribute('name', language, card.detail.name),
        this.buildAttribute('text', language, card.detail.text),
        this.buildAttribute('effect', language, card.detail.effect),
        this.buildAttribute('toSolve', language, card.detail.toSolve),
        this.buildAttribute('reward', language, card.detail.reward),
        this.buildAttribute('flavorText', language, card.detail.flavorText),
        this.buildAttribute('illustrator', language, card.detail.illustrator),
        this.buildAttribute('copyright', language, card.detail.copyright),
        this.buildAttribute('orientation', language, card.detail.orientation),
        this.buildAttribute('set', language, card.cardSet.name),
        this.buildAttribute('setShortName', language, card.detail.text),
        this.buildAttribute('type', language, card.cardType.name),
        this.buildAttribute('subTypes', language, cardSubTypes),
        this.buildAttribute('rarity', language, card.rarity.name),
        this.buildAttribute('raritySymbol', language, card.detail.text),
        this.buildAttribute('lessonType', language, card.lessonType?.name),
        this.buildAttribute('providesLesson', language, card.providesLesson),
        this.buildAttribute('lessonCost', language, card.lessonCost),
        this.buildAttribute('actionCost', language, card.actionCost),
        this.buildAttribute('cardNumber', language, card.cardNumber),
        this.buildAttribute('health', language, card.health),
        this.buildAttribute('damage', language, card.damage),
        this.buildAttribute('metaDescription', language, card.metaDescription),
        this.buildAttribute('restrictions', language, card.rulingRestrictions),
        this.buildAttribute('images', language, cardImages),
      ].filter((attribute) => !!attribute),
    };
  }

  mapCards(gameId: string, cards: CardFromJsonFile[]): CardModel[] {
    const mappedCards: CardModelForImporting[] = [];

    for (const card of cards) {
      const builtCard = this.buildCardFromJsonFileToModel(gameId, card);
      const cardIndex = mappedCards.findIndex(
        (map) => map.tempCardId === builtCard.tempCardId,
      );

      if (cardIndex !== -1) {
        mappedCards[cardIndex] = {
          gameId,
          tempCardId: builtCard.tempCardId,
          attributes: [
            ...mappedCards[cardIndex].attributes,
            ...builtCard.attributes,
          ],
        };
        continue;
      }

      mappedCards.push(builtCard);
    }

    return mappedCards;
  }

  async importAllSets(): Promise<boolean> {
    try {
      const baseAssetsPath = './src/assets';
      const cardGamePaths = fs.readdirSync(baseAssetsPath);
      for (const cardGamePath of cardGamePaths) {
        const gameAssetsPath = path.join(baseAssetsPath, cardGamePath);

        const game = await this.gameService.insert({
          code: cardGamePath,
          name: CardGameName[cardGamePath],
          description: cardGamePath,
          imageUrl: 'replacement',
        });

        const cardSetPaths = fs.readdirSync(gameAssetsPath);

        for (const cardSetPath of cardSetPaths) {
          const cardSetName = cardSetPath.split('.')[0];

          console.log(`Importing set: ${cardSetName}...`);
          const setPath = path.join(gameAssetsPath, cardSetPath);
          const cards = await this.readFromSet(setPath);
          const mappedCards = this.mapCards(game._id, cards);

          console.log(`Number of cards: ${mappedCards.length}`);

          await this.cardService.insertMany(mappedCards);
          await this.gameService.incrementNumberOfCardsById(
            game._id,
            mappedCards.length,
          );
        }
      }

      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  }
}
