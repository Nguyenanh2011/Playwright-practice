import { expect } from '@playwright/test';
import { test } from '../fixtures/conduit';
import { USER } from '../testdata/users/user';

test.describe('Login flow', () => {
    test('Verify the user logins in successfully', async ({ loginPage, homePage }) => {
        // Arrange
        await loginPage.navigateToLoginPage();

        // Act
        await loginPage.login(USER.email, USER.password);

        // Assert
        expect(await homePage.getUsername()).toBe(USER.username);
    });
});
