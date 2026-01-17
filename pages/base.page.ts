import { Locator, Page } from '@playwright/test';

export default class BasePage {
    public page: Page;

    constructor(page: Page) {
        this.page = page;
    }
    async navigateTo(endpoint: string): Promise<void> {
        const url = process.env.BASE_URL + endpoint;
        await this.page.goto(url, { waitUntil: 'load' });
    }

    async getText(locator: Locator): Promise<string> {
        return (await locator.textContent())?.trim() || '';
    }

    async pressEnter(): Promise<void> {
        await this.page.keyboard.press('Enter');
    }
}
