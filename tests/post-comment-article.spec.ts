import { expect } from '@playwright/test';
import { DataUtils } from '../core/utils/data';
import { dataStorage } from '../core/utils/data-storage';
import { test } from '../fixtures/conduit';

test.describe('Post comment flow', () => {
    test.beforeEach(async ({ articleDetailPage, articleService, headers }) => {
        const article = {
            title: DataUtils.generateSentence(),
            description: DataUtils.generateSentence(10),
            body: DataUtils.generateParagraph(),
            tags: DataUtils.generateWordsArray(3),
        };
        const response = await articleService.createArticle(article, headers);
        const articleId = response.body.article.slug;
        await articleDetailPage.navigateToArticleDetailPage(articleId);
        dataStorage.setItem('articleId', await articleDetailPage.getArticleId());
    });
    test('Verify the user can post comment to an article', async ({ articleDetailPage }) => {
        // Arrange
        const comment = DataUtils.generateSentence();

        // Act
        await articleDetailPage.postComment(comment);

        // Assert
        expect(await articleDetailPage.getCommentText()).toBe(comment);
    });

    test.afterEach(async ({ articleService, headers }) => {
        if (dataStorage.getItem('articleId')) {
            const response = await articleService.deleteArticle(dataStorage.getItem('articleId'), headers);
            expect(response.status).toBe(204);
        }
    });
});
