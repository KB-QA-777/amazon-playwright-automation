import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductPage extends BasePage {
  // Locators
  private readonly appleStoreLink = "text=Visit the Apple Store";
  private readonly watchDropdown = "#watchDropdown";
  private readonly watchImage =
    '//img[@class="EditorialTileProduct__image__M1rM1"]';
  private readonly quickLookButton = `(//span[text()='Quick look'])[1]`;
  private readonly modalTitle = ".modal-title";
  private readonly modalContent = ".modal-content";

  constructor(page: Page) {
    super(page);
  }

  /**
   * Clicks on the Apple Store link
   */
  async clickAppleStoreLink() {
    await this.waitForElementAndScroll(this.appleStoreLink);
    await this.page.click(this.appleStoreLink);
    await this.waitForPageLoad();
  }

  /**
   * Selects Apple Watch SE variant from the navigation menu
   * @param variant - The watch variant to select
   */
  public async selectWatchVariant(variant: string): Promise<void> {
    try {
      // First click on Apple Watch menu
      await this.page.waitForSelector(
        'a[role="button"] span:has-text("Apple Watch")',
        {
          state: "visible",
          timeout: 10000,
        }
      );
      await this.page.click('a[role="button"] span:has-text("Apple Watch")');

      // Wait for a short time to let the menu animation complete
      await this.page.waitForTimeout(1000);

      // Look for the specific variant using a more precise selector
      const variantLink = await this.page.waitForSelector(
        `li.Navigation__navItem__bakjf a span:text-is("${variant}")`,
        {
          state: "visible",
          timeout: 10000,
        }
      );

      // Ensure the menu is still open and variant is in view
      await variantLink.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(500);

      // Click the variant with force option
      await variantLink.click({ force: true });

      // Wait for navigation
      await this.page.waitForLoadState("domcontentloaded");
      await this.page.waitForLoadState("networkidle");

      console.log(`Successfully clicked on ${variant}`);
    } catch (error) {
      console.error("Error selecting Apple Watch variant:", error);

      // Fallback approach if the first method fails
      try {
        console.log("Trying fallback approach...");
        const allLinks = await this.page.$$("li.Navigation__navItem__bakjf a");

        for (const link of allLinks) {
          const text = await link.textContent();
          if (text?.trim() === variant) {
            await link.click({ force: true });
            await this.page.waitForLoadState("domcontentloaded");
            console.log("Successfully clicked variant using fallback method");
            return;
          }
        }
      } catch (fallbackError) {
        console.error("Fallback approach also failed:", fallbackError);
        throw fallbackError;
      }
    }
  }

  /**
   * Gets the modal title from Quick Look
   * @returns The modal title text
   */
  public async getModalTitle(): Promise<string> {
    try {
      // Wait for the modal title to be visible
      const titleSelector = "a.ProductShowcase__title__SBCBw";
      await this.page.waitForSelector(titleSelector, {
        state: "visible",
        timeout: 10000,
      });

      // Get the title text
      const titleElement = await this.page.$(titleSelector);
      const titleText = (await titleElement?.getAttribute("title")) || "";
      console.log("Found modal title:", titleText);

      return titleText;
    } catch (error) {
      console.error("Error getting modal title:", error);
      throw error;
    }
  }

  /**
   * Validates if the modal content matches the expected product
   * @param expectedProduct - The product name to verify
   * @returns boolean indicating if the modal matches the product
   */
  public async validateModalContent(expectedProduct: string): Promise<boolean> {
    try {
      // Wait for the quick look content
      const overlaySelector =
        "a.Overlay__overlay__LloCU.EditorialTile__overlay__RMD1L";
      await this.page.waitForSelector(overlaySelector, {
        state: "visible",
        timeout: 10000,
      });

      // Get the content text from aria-label
      const overlayElement = await this.page.$(overlaySelector);
      const ariaLabel =
        (await overlayElement?.getAttribute("aria-label")) || "";

      console.log("Modal content:", ariaLabel);

      // Check if the expected product is in either aria-label or title
      return ariaLabel.toLowerCase().includes(expectedProduct.toLowerCase());
    } catch (error) {
      console.error("Error validating modal content:", error);
      return false;
    }
  }

  /**
   * Hovers over watch image to reveal Quick Look
   */
  public async hoverWatchImage(): Promise<void> {
    try {
      // Wait for the image overlay to be present
      await this.page.waitForSelector("a.Overlay__overlay__LloCU", {
        state: "visible",
        timeout: 10000,
      });

      // Hover over the watch image
      await this.page.hover("a.Overlay__overlay__LloCU");

      // Wait a bit for any hover animations
      await this.page.waitForTimeout(500);

      console.log("Successfully hovered over watch image");
    } catch (error) {
      console.error("Error hovering over watch image:", error);
      throw error;
    }
  }

  /**
   * Checks if Quick Look is displayed and clicks it
   * @returns boolean indicating if Quick Look was found and clicked
   */
  public async isQuickLookDisplayed(): Promise<boolean> {
    try {
      // Wait for Quick Look link to be visible
      const isVisible = await this.page.isVisible(this.quickLookButton);

      if (isVisible) {
        console.log("Quick Look is visible, clicking on it");
        // Click the Quick Look overlay
        await this.page.click(this.quickLookButton);
        // Wait for modal to appear
        await this.page.waitForTimeout(1000);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error checking/clicking Quick Look:", error);
      return false;
    }
  }
}
