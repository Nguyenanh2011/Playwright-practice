import { test as base } from '@playwright/test';
import { ArticleService } from '../api-service/article-service';
import { AuthService } from '../api-service/auth-service';
import ArticleDetailPage from '../pages/article-detail.page';
import EditorPage from '../pages/editor.page';
import HomePage from '../pages/home.page';
import LoginPage from '../pages/login.page';
import SignupPage from '../pages/signup.page';
import { USER } from '../testdata/users/user';

let cachedToken: string | null = null;

export const test = base.extend<{
    loginPage: LoginPage;
    signupPage: SignupPage;
    homePage: HomePage;
    editorPage: EditorPage;
    articleDetailPage: ArticleDetailPage;
    articleService: ArticleService;
    authService: AuthService;
    token: string;
    headers: Record<string, string>;
}>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    signupPage: async ({ page }, use) => {
        const signupPage = new SignupPage(page);
        await use(signupPage);
    },
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },
    token: async ({ page, authService }, use) => {
        if (!cachedToken) {
            cachedToken = await authService.loginByAPI(USER.email, USER.password);
        }

        await page.addInitScript((token) => {
            window.localStorage.setItem('jwtToken', token);
        }, cachedToken);

        await use(cachedToken);
    },
    editorPage: async ({ page }, use) => {
        const editorPage = new EditorPage(page);
        await use(editorPage);
    },
    articleDetailPage: async ({ page }, use) => {
        const articleDetailPage = new ArticleDetailPage(page);
        await use(articleDetailPage);
    },
    articleService: async ({}, use) => {
        const articleService = new ArticleService();
        await use(articleService);
    },
    authService: async ({}, use) => {
        const authService = new AuthService();
        await use(authService);
    },
    headers: async ({ token }, use) => {
        const headers = new AuthService().getAuthHeaders(token);
        await use(headers);
    },
});
