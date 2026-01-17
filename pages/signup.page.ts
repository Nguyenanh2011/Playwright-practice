import { Locator, Page } from '@playwright/test';
import { URLS } from '../constants/urls';
import BasePage from './base.page';

export default class SignupPage extends BasePage {
    private readonly username: Locator;
    private readonly email: Locator;
    private readonly password: Locator;
    private readonly signupButton: Locator;
    constructor(page: Page) {
        super(page);
        this.username = page.getByPlaceholder('Username');
        this.email = page.getByPlaceholder('Email');
        this.password = page.getByPlaceholder('Password');
        this.signupButton = page.locator('button[type="submit"]');
    }
    async navigateToSignupPage() {
        await this.navigateTo(URLS.SIGNUP);
    }
    async signup(username: string, email: string, password: string) {
        await this.username.fill(username);
        await this.email.fill(email);
        await this.password.fill(password);
        await this.signupButton.click();
    }
}
