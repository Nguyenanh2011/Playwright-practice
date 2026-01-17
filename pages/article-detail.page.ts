import { Locator, Page } from '@playwright/test';
import { URLS } from '../constants/urls';
import BasePage from './base.page';

export default class ArticleDetailPage extends BasePage {
    private readonly articleTitle: Locator;
    private readonly articleBody: Locator;
    private readonly articleTag: Locator;
    private readonly commentInput: Locator;
    private readonly commentButton: Locator;
    private readonly comment: Locator;
    private readonly deleteCommentIcon: Locator;

    constructor(page: Page) {
        super(page);
        this.articleTitle = page.locator('h1');
        this.articleBody = page.locator('p');
        this.articleTag = page.locator('.tag-pill');
        this.commentInput = page.locator('textarea');
        this.commentButton = page.locator('button[type="submit"]');
        this.comment = page.locator('.card-text');
        this.deleteCommentIcon = page.locator('.mod-options .ion-trash-a');
    }

    async navigateToArticleDetailPage(articleId: string) {
        await this.navigateTo(`${URLS.ARTICLE}/${articleId}`);
    }
    async getArticleTitle(): Promise<string> {
        return await this.getText(this.articleTitle);
    }
    async getArticleBody(): Promise<string> {
        return await this.getText(this.articleBody);
    }
    async getArticleTags(): Promise<string[]> {
        const tagElements = await this.articleTag.allTextContents();
        return tagElements.map((tag) => tag.trim());
    }
    async getArticleId(): Promise<string> {
        await this.articleTitle.waitFor({ state: 'visible' });
        const url = this.page.url();
        const match = url.match(/\/article\/([^/?#]+)/);
        return match ? match[1] : '';
    }
    async postComment(comment: string) {
        await this.commentInput.fill(comment);
        await this.commentButton.click();
    }
    async getCommentText(): Promise<string> {
        return await this.getText(this.comment);
    }
    getComment(): Locator {
        return this.comment;
    }
    async deleteComment() {
        await this.deleteCommentIcon.click();
    }
}
