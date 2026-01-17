import { Locator, Page } from '@playwright/test';
import { URLS } from '../constants/urls';
import BasePage from './base.page';

export default class LoginPage extends BasePage {
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    constructor(page: Page) {
        super(page);
        this.emailInput = page.getByPlaceholder('Email');
        this.passwordInput = page.getByPlaceholder('Password');
        this.loginButton = page.locator('button[type="submit"]');
    }

    async navigateToLoginPage() {
        await this.navigateTo(URLS.LOGIN);
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}
