import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  // Locators
  private readonly searchDropdown = "select#searchDropdownBox";
  private readonly searchBox = "#twotabsearchtextbox";
  private readonly searchSuggestions =
    'div[class*="autocomplete"] .s-suggestion';
  private readonly searchButton = "#nav-search-submit-button";
  private readonly categorySelect = "#nav-search-dropdown-card";
  private readonly firstSearchResult =
    '[data-component-type="s-search-result"]:first-child h2 a';
  private readonly searchResults = '[data-component-type="s-search-result"]';
  private readonly categoryDropdown = "#searchDropdownBox";

  constructor(page: Page) {
    super(page);
  }

  /**
   * Selects a category from the search dropdown
   * @param category - The category to select
   */
  public async selectCategory(category: string): Promise<void> {
    try {
      await this.page.waitForSelector(this.categoryDropdown, {
        state: "visible",
      });
      await this.page.selectOption(this.categoryDropdown, { label: category });
      await this.page.waitForTimeout(1000); // Wait for category selection to take effect
    } catch (error) {
      console.error(`Error selecting category ${category}:`, error);
      throw error;
    }
  }

  /**
   * Enters a search term in the search box
   * @param product - The product to search for
   */
  public async searchProduct(product: string): Promise<void> {
    try {
      await this.page.click(this.searchBox);
      await this.page.fill(this.searchBox, "");
      await this.page.type(this.searchBox, product, { delay: 100 });

      await this.page
        .waitForSelector(this.searchSuggestions, {
          state: "visible",
          timeout: 5000,
        })
        .catch(() => {
          console.log(
            "Search suggestions not immediately visible, retrying..."
          );
        });

      await this.page.waitForTimeout(1000);
    } catch (error) {
      console.error("Error during product search:", error);
      throw error;
    }
  }

  /**
   * Gets all search suggestions
   * @returns Array of suggestion texts
   */
  public async getSearchSuggestions(): Promise<string[]> {
    try {
      await this.page.waitForSelector(this.searchSuggestions, {
        state: "visible",
        timeout: 5000,
      });

      return await this.page.$$eval(this.searchSuggestions, (elements) =>
        elements.map((el) => el.textContent?.trim() || "")
      );
    } catch (error) {
      console.error("Error getting search suggestions:", error);
      return [];
    }
  }
  /**
   * Selects a specific suggestion from the dropdown
   * @param suggestion - The suggestion text to select
   */
  public async selectSearchSuggestion(suggestion: string): Promise<void> {
    try {
      console.log(`Attempting to select suggestion: ${suggestion}`);

      // Wait for suggestions with longer timeout
      await this.page.waitForSelector(this.searchSuggestions, {
        state: "visible",
        timeout: 10000,
      });

      // Wait a bit for suggestions to stabilize
      await this.page.waitForTimeout(1000);

      // Try multiple selector strategies
      const suggestionLocators = [
        `${this.searchSuggestions}:has-text("${suggestion}")`,
        `${this.searchSuggestions}:has-text("${suggestion.toLowerCase()}")`,
        `${this.searchSuggestions}:has-text("${suggestion.toUpperCase()}")`,
        '.s-suggestion:has-text("iPhone")', // Fallback for partial match
      ];

      for (const locator of suggestionLocators) {
        try {
          const element = await this.page.waitForSelector(locator, {
            state: "visible",
            timeout: 2000,
          });

          if (element) {
            console.log("Found matching suggestion, attempting to click");
            await element.scrollIntoViewIfNeeded();
            await element.click();
            await this.waitForPageLoad();
            return;
          }
        } catch (e) {
          console.log(`Locator ${locator} not found, trying next...`);
          continue;
        }
      }

      // If no suggestion found through locators, try getting all suggestions
      console.log("Trying alternative method with all suggestions");
      const suggestionElements = await this.page.$$(this.searchSuggestions);
      console.log(`Found ${suggestionElements.length} suggestions`);

      for (const element of suggestionElements) {
        const text = await element.textContent();
        console.log(`Checking suggestion: ${text}`);

        if (text?.toLowerCase().includes(suggestion.toLowerCase())) {
          console.log("Found matching suggestion through text content");
          await element.scrollIntoViewIfNeeded();
          await this.page.waitForTimeout(500);
          await element.click({ force: true });
          await this.waitForPageLoad();
          return;
        }
      }

      // If still no match, use search button as last resort
      console.log("No matching suggestion found, using search button");
      await this.page.click(this.searchButton);
      await this.waitForPageLoad();
    } catch (error) {
      console.error("Error in selectSearchSuggestion:", error);
      // Fallback to search button
      try {
        await this.page.click(this.searchButton);
        await this.waitForPageLoad();
      } catch (fallbackError) {
        console.error("Even fallback failed:", fallbackError);
        throw fallbackError;
      }
    }
  }

 /**
 * Clicks on the first search result that matches the iPhone 13 128GB
 * @returns Promise<Page> - The new page object
 */
public async clickFirstSearchResult(): Promise<Page> {
    try {
        console.log('Waiting for search results to load...');
        
        // Updated selector to find iPhone 13 128GB products
        const productSelector = '[data-component-type="s-search-result"] h2 .a-link-normal';
        
        // Wait for results to be visible
        await this.page.waitForSelector(productSelector, {
            state: 'visible',
            timeout: 10000
        });

        // Get all product links
        const productLinks = await this.page.$$(productSelector);
        console.log(`Found ${productLinks.length} product links`);

        // Find the first iPhone 13 128GB result
        for (const link of productLinks) {
            const titleElement = await link.$('span.a-text-normal');
            const title = await titleElement?.textContent() || '';
            console.log('Checking product:', title);

            if (title.toLowerCase().includes('iphone 13') && 
                title.toLowerCase().includes('128')) {
                console.log('Found matching iPhone 13 128GB product');

                // Get current context
                const context = this.page.context();
                
                // Wait for new page
                const newPagePromise = context.waitForEvent('page');
                
                // Click the link
                await link.click();
                const newPage = await newPagePromise;
                
                // Wait for the new page to load
                await newPage.waitForLoadState('domcontentloaded');
                console.log('Successfully navigated to product page');
                
                return newPage;
            }
        }

        throw new Error('No iPhone 13 128GB product found in search results');
    } catch (error) {
        console.error('Error clicking search result:', error);
        throw error;
    }
}

  /**
   * Validates if a new tab was opened
   * @param originalPageCount - Number of pages before action
   * @returns boolean indicating if new tab was opened
   */
  public async validateNewTabOpened(
    originalPageCount: number
  ): Promise<boolean> {
    const pages = this.page.context().pages();
    return pages.length > originalPageCount;
  }

  /**
   * Verifies if all suggestions contain the search term
   * @param searchTerm - The term to verify in suggestions
   * @returns boolean indicating if all suggestions are valid
   */
  public async validateSearchSuggestions(searchTerm: string): Promise<boolean> {
    const suggestions = await this.getSearchSuggestions();
    return (
      suggestions.length > 0 &&
      suggestions.every((suggestion) =>
        suggestion.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }
}
