import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import * as allure from 'allure-playwright';

test.describe('Amazon Product Search and Navigation Tests', () => {
    let homePage: HomePage;
    let productPage: ProductPage;

    // Initialize pages before each test
    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        productPage = new ProductPage(page);
    });

    test('should complete end-to-end iPhone search and Apple Watch selection flow', async ({ page, context }, testInfo) => {
        try {
            // Test description for Allure report
            await testInfo.attach('test-description', {
                contentType: 'text/plain',
                body: 'End-to-end test validating iPhone search, navigation, and Apple Watch selection functionality on Amazon.in'
            });

            // Step 1: Navigate to Amazon
            await test.step('Navigate to Amazon.in', async () => {
                await page.goto('/');
                await homePage.waitForPageLoad();
                await testInfo.attach('homepage-loaded', {
                    body: await page.screenshot(),
                    contentType: 'image/png'
                });
                console.log('Successfully navigated to Amazon.in');
            });

            // Step 2: Select Electronics category and search for iPhone
            await test.step('Search for iPhone 13 in Electronics category', async () => {
                await homePage.selectCategory('Electronics');
                await homePage.searchProduct('iPhone 13');
                await testInfo.attach('search-initiated', {
                    body: await page.screenshot(),
                    contentType: 'image/png'
                });
                console.log('Completed iPhone 13 search in Electronics category');
            });

            // Step 3: Validate search suggestions
            await test.step('Validate search suggestions', async () => {
                const suggestions = await homePage.getSearchSuggestions();
                expect(suggestions.length, 'Should have search suggestions').toBeGreaterThan(0);
                
                const allSuggestionsValid = await homePage.validateSearchSuggestions('iPhone 13');
                expect(allSuggestionsValid, 'All suggestions should be related to iPhone 13').toBeTruthy();
                
                await testInfo.attach('search-suggestions', {
                    body: await page.screenshot(),
                    contentType: 'image/png'
                });
                console.log('Validated search suggestions successfully');
            });

            // Step 4: Search for specific iPhone variant and click result
            await test.step('Search for iPhone 13 128GB variant and click result', async () => {
                // Search for specific variant
                await homePage.searchProduct('iPhone 13 128 GB');
                await homePage.selectSearchSuggestion('iPhone 13 128GB');

                // Store initial page count
                const initialPageCount = context.pages().length;

                // Click first search result and get new page
                const newPage = await homePage.clickFirstSearchResult();
                
                // Validate new tab was opened
                const newTabOpened = await homePage.validateNewTabOpened(initialPageCount);
                expect(newTabOpened, 'New tab should be opened').toBeTruthy();

                // Validate URL contains product information
                expect(newPage.url()).toContain('iPhone-13');

                // Switch context to new page for further operations
                await newPage.bringToFront();
                productPage = new ProductPage(newPage);
                
                await testInfo.attach('product-page-loaded', {
                    body: await newPage.screenshot(),
                    contentType: 'image/png'
                });
                console.log('Successfully navigated to product page');
            });

            // Step 5: Validate new tab
            await test.step('Validate new tab content', async () => {
                const newPage = await homePage.switchToTab(1);
                expect(newPage.url()).toContain('iPhone-13-128GB');
                console.log('Validated new tab content');
            });

            // Step 6: Navigate to Apple Store
            await test.step('Navigate to Apple Store', async () => {
                await productPage.clickAppleStoreLink();
                await testInfo.attach('apple-store-page', {
                    body: await page.screenshot(),
                    contentType: 'image/png'
                });
                console.log('Navigated to Apple Store successfully');
            });

            // Step 7: Select Apple Watch variant
            await test.step('Select Apple Watch SE variant', async () => {
                await productPage.selectWatchVariant('Apple Watch SE (GPS + Cellular)');
                await testInfo.attach('watch-variant-selected', {
                    body: await page.screenshot(),
                    contentType: 'image/png'
                });
                console.log('Selected Apple Watch variant');
            });

            // Step 8: Verify Quick Look functionality
            await test.step('Verify Quick Look functionality', async () => {
                // Hover and check Quick Look
                await productPage.hoverWatchImage();
                expect(await productPage.isQuickLookDisplayed()).toBeTruthy();
                
                await testInfo.attach('quick-look-displayed', {
                    body: await page.screenshot(),
                    contentType: 'image/png'
                });

                // Verify modal title
                const modalTitle = await productPage.getModalTitle();
                expect(modalTitle).toContain('Apple Watch SE');

                // Verify modal content
                const isModalContentValid = await productPage.validateModalContent('Apple Watch SE');
                expect(isModalContentValid).toBeTruthy();
                
                await testInfo.attach('modal-validation', {
                    body: await page.screenshot(),
                    contentType: 'image/png'
                });
                console.log('Verified Quick Look functionality');
            });

        } catch (error) {
            console.error('Test failed:', error);
            // Take screenshot on failure
            await testInfo.attach('failure-screenshot', {
                body: await page.screenshot(),
                contentType: 'image/png'
            });
            throw error;
        }
    });

    // Clean up after each test
    test.afterEach(async ({ context }) => {
        await context.close();
    });
});

// Custom error handler
test.afterEach(async ({ }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
        // Log test failure details
        console.error(`Test failed: ${testInfo.title}`);
        console.error(`Error: ${testInfo.error?.message}`);
        console.error(`Stack trace: ${testInfo.error?.stack}`);
    }
});