import { expect } from '@playwright/test';
import { DataUtils } from '../core/utils/data';
import { dataStorage } from '../core/utils/data-storage';
import { test } from '../fixtures/conduit';

test.describe('Delete comment flow', () => {
    test.beforeEach(async ({ homePage, editorPage, articleDetailPage, token }) => {
        await homePage.navigateToHomePage();
        await homePage.clickNewArticleLink();
        const article = {
            title: DataUtils.generateSentence(),
            description: DataUtils.generateSentence(10),
            body: DataUtils.generateParagraph(),
            tags: DataUtils.generateWordsArray(3),
        };
        await editorPage.createArticle(article);
        dataStorage.setItem('articleId', await articleDetailPage.getArticleId());
    });
    test('Verify the user can delete a comment from an article', async ({ articleDetailPage }) => {
        // Arrange
        const comment = DataUtils.generateSentence();
        await articleDetailPage.postComment(comment);

        // Act
        await articleDetailPage.deleteComment();

        // Assert
        await expect(articleDetailPage.getComment()).toBeHidden();
    });

    test.afterEach(async ({ articleService, headers }) => {
        if (dataStorage.getItem('articleId')) {
            const response = await articleService.deleteArticle(dataStorage.getItem('articleId'), headers);
            expect(response.status).toBe(204);
        }
    });
});
