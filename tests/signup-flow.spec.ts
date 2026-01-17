import { expect } from '@playwright/test';
import { DataUtils } from '../core/utils/data';
import { test } from '../fixtures/conduit';

test.describe('Sign up flow', () => {
    test('Verify the username is displayed when creating successfully', async ({ signupPage, homePage }) => {
        // Arrange
        await signupPage.navigateToSignupPage();
        const username = DataUtils.generateUsername();
        const email = DataUtils.generateEmail();
        const password = DataUtils.generatePassword();

        // Act
        await signupPage.signup(username, email, password);

        // Assert
        expect(await homePage.getUsername()).toBe(username);
    });
});
