export interface Attribute {
  key: string;
  value: string;
  language: string;
  values: string[];
}

export interface CardFromJsonFile {
  cardId: string;
  detail: {
    cardDetailId: string;
    cardId: string;
    language: {
      languageId: string;
      name: string;
      code: string;
    };
    name: string;
    text: string;
    effect: string;
    toSolve: string;
    reward: string;
    flavorText: string;
    illustrator: string;
    copyright: string;
    note: string;
    orientation: string;
  };
  cardSet: {
    setId: string;
    name: string;
    shortName: string;
    description: string;
    order: string;
    releaseDate: string;
    totalCards: string;
    languages: string[];
  };
  cardType: {
    cardTypeId: string;
    name: string;
  };
  subTypes: {
    cardSubTypeId: string;
    subType: {
      subTypeId: string;
      name: string;
      cardId: string;
    };
  }[];
  rarity: {
    rarityId: string;
    name: string;
    symbol: string;
  };
  lessonType: {
    lessonTypeId: string;
    name: string;
  };
  providesLesson: string;
  lessonCost: string;
  actionCost: string;
  cardNumber: string;
  orientation: string;
  health?: string;
  damage?: string;
  images: {
    imageId: string;
    language: {
      languageId: string;
      name: string;
      code: string;
    };
    url: string;
    size: string;
  }[];
  metaDescription: string;
  cardPageUrl: string;
  rulingRestrictions: string[];
}
