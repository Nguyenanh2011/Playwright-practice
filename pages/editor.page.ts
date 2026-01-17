import { Locator, Page } from '@playwright/test';
import { Article } from '../data-object/article';
import BasePage from './base.page';

export default class EditorPage extends BasePage {
    private readonly articleTitle: Locator;
    private readonly articleDescription: Locator;
    private readonly articleBody: Locator;
    private readonly articleTags: Locator;
    private readonly publishButton: Locator;
    constructor(page: Page) {
        super(page);
        this.articleTitle = page.locator('input[formcontrolname="title"]');
        this.articleDescription = page.locator('input[formcontrolname="description"]');
        this.articleBody = page.locator('textarea[formcontrolname="body"]');
        this.articleTags = page.getByPlaceholder('Enter tags');
        this.publishButton = page.locator('button[type="button"]');
    }

    async createArticle(article: Article) {
        await this.articleTitle.fill(article.title);
        await this.articleDescription.fill(article.description);
        await this.articleBody.fill(article.body);
        for (const tag of article.tags) {
            await this.articleTags.fill(tag);
            await this.pressEnter();
        }
        await this.publishButton.click();
    }
}
