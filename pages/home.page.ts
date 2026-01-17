import { Locator, Page } from '@playwright/test';
import { URLS } from '../constants/urls';
import BasePage from './base.page';

export default class HomePage extends BasePage {
    private readonly username: Locator;
    private readonly newArticleLink: Locator;
    constructor(page: Page) {
        super(page);
        this.username = page.locator('a:has(img.user-pic)');
        this.newArticleLink = page.locator('a[href="/editor"]');
    }

    async navigateToHomePage(): Promise<void> {
        await this.navigateTo(URLS.HOME);
    }

    async getUsername(): Promise<string> {
        return await this.getText(this.username);
    }

    async clickNewArticleLink(): Promise<void> {
        await this.newArticleLink.click();
    }
}
