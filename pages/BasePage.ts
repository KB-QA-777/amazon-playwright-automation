import { Page, expect } from "@playwright/test";

export class BasePage {
  constructor(protected page: Page) {}

  /**
   * Waits for the page to finish loading
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState("domcontentloaded");
  }

  /**
   * Switches to a specific tab by index
   * @param index - The index of the tab to switch to
   * @returns The page object for the new tab
   */
  async switchToTab(index: number) {
    const pages = this.page.context().pages();
    if (pages.length <= index) {
      throw new Error(`No tab exists at index ${index}`);
    }
    await pages[index].bringToFront();
    await pages[index].waitForLoadState("domcontentloaded");
    return pages[index];
  }

  /**
   * Gets the latest opened tab
   * @returns The most recently opened page
   */
  async getLatestTab(): Promise<Page> {
    const pages = this.page.context().pages();
    const newPage = pages[pages.length - 1];
    await newPage.waitForLoadState("domcontentloaded");
    return newPage;
  }

  /**
   * Waits for an element and scrolls it into view
   * @param selector - The selector for the element
   */
  async waitForElementAndScroll(selector: string) {
    const element = await this.page.waitForSelector(selector, {
      state: "visible",
      timeout: 10000,
    });
    await element.scrollIntoViewIfNeeded();
    return element;
  }

  /**
   * Takes a screenshot with a custom name
   * @param name - The name for the screenshot
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({
      path: `./screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }

  /**
   * Validates if element exists on page
   * @param selector - The selector to check
   * @returns boolean indicating if element exists
   */
  async elementExists(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, {
        state: "visible",
        timeout: 5000,
      });
      return true;
    } catch {
      return false;
    }
  }
}
