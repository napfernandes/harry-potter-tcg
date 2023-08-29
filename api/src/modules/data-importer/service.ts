import * as fs from 'fs';
import { Injectable } from '@nestjs/common';

import { CardSet } from '../card/enum';
import { CardModel } from '../card/model';
import { CardService } from '../card/service';
import { CardFromJsonFile } from './interface';
import { AttributeModel, AttributeValue } from '../attribute/model';

type CardModelForImporting = CardModel & { tempCardId: string };

@Injectable()
export class DataImporterService {
  setFilePath = '';

  constructor(private readonly cardService: CardService) {}

  cardSetsAndFileNames: Record<CardSet, string> = {
    [CardSet.ADVENTURES_AT_HOGWARTS]: 'adventures-at-hogwarts',
    [CardSet.BASE_SET]: 'base-set',
    [CardSet.CHAMBER_OF_SECRETS]: 'chamber-of-secrets',
    [CardSet.DIAGON_ALLEY]: 'diagon-alley',
    [CardSet.ECHOES_OF_THE_PAST]: 'echoes-of-the-past',
    [CardSet.HEIR_OF_SLYTHERIN]: 'heir-of-slytherin',
    [CardSet.PRISONER_OF_ASKABAN]: 'prisoner-of-askaban',
    [CardSet.QUIDDITCH_CUP]: 'quidditch-cup',
    [CardSet.STREETS_OF_HOGSMEADE]: 'streets-of-hogsmeade',
  };

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

  buildCardFromJsonFileToModel(card: CardFromJsonFile): CardModelForImporting {
    const language = card.detail.language.code.toLowerCase();
    const cardSubTypes = card.subTypes.map((subType) => subType.subType.name);
    const cardImages = card.images.map((image) => ({
      language: image.language.code.toLowerCase(),
      url: image.url,
    }));

    return {
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

  mapCards(cards: CardFromJsonFile[]): CardModel[] {
    const mappedCards: CardModelForImporting[] = [];

    for (const card of cards) {
      const builtCard = this.buildCardFromJsonFileToModel(card);
      const cardIndex = mappedCards.findIndex(
        (map) => map.tempCardId === builtCard.tempCardId,
      );

      if (cardIndex !== -1) {
        mappedCards[cardIndex] = {
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
      const keys = Object.keys(this.cardSetsAndFileNames);

      for (const key of keys) {
        console.log(
          `Importing set: ${key.toUpperCase()} (${
            this.cardSetsAndFileNames[key]
          })...`,
        );
        const setPath = `./src/assets/harry-potter-tcg-${this.cardSetsAndFileNames[key]}.json`;
        const cards = await this.readFromSet(setPath);
        const mappedCards = this.mapCards(cards);

        console.log(`Number of cards: ${mappedCards.length}`);

        await this.cardService.insertMany(mappedCards);
      }

      console.log(`Importing finished.`);

      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  }
}
