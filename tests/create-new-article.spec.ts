import { expect } from '@playwright/test';
import { DataUtils } from '../core/utils/data';
import { dataStorage } from '../core/utils/data-storage';
import { test } from '../fixtures/conduit';

test.describe('Create new article flow', () => {
    test('Verify the user can create new article', { tag: '@create' }, async ({ homePage, editorPage, articleDetailPage, token }) => {
        // Arrange
        await homePage.navigateToHomePage();
        await homePage.clickNewArticleLink();
        const article = {
            title: DataUtils.generateSentence(),
            description: DataUtils.generateSentence(10),
            body: DataUtils.generateParagraph(),
            tags: DataUtils.generateWordsArray(3),
        };

        // Act
        await editorPage.createArticle(article);

        // Assert
        const actualTags = await articleDetailPage.getArticleTags();

        expect(await articleDetailPage.getArticleTitle()).toBe(article.title);
        expect(await articleDetailPage.getArticleBody()).toBe(article.body);
        expect(actualTags.sort()).toEqual(article.tags.sort());
        dataStorage.setItem('articleId', await articleDetailPage.getArticleId());
    });

    test.afterEach(async ({ articleService, headers }) => {
        if (dataStorage.getItem('articleId')) {
            const response = await articleService.deleteArticle(dataStorage.getItem('articleId'), headers);
            expect(response.status).toBe(204);
        }
    });
});
