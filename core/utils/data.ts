import { faker } from '@faker-js/faker';

export const DataUtils = {
    generateSentence: (words: number = 3) => faker.lorem.sentence(words),
    generateParagraph: (paragraphs: number = 3) => faker.lorem.paragraph(paragraphs),
    generateWordsArray: (length: number = 2) => faker.helpers.uniqueArray(() => faker.lorem.word(), length),
    generateUsername: () => faker.internet.username(),
    generateEmail: () => faker.internet.email(),
    generatePassword: () => faker.internet.password(),
};
