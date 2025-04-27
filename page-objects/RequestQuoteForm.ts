import { Page, Locator, expect } from '@playwright/test';

export class RequestQuoteForm {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly messageInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator('input[name="name"]');
    this.emailInput = page.locator('input[name="email"]');
    this.messageInput = page.locator('textarea[name="message"]');
    this.submitButton = page.locator('input[type="submit"]');
  }

  async fillName(name: string) {
    await this.nameInput.scrollIntoViewIfNeeded();
    await this.nameInput.fill(name);
  }

  async fillEmail(email: string) {
    await this.emailInput.scrollIntoViewIfNeeded();
    await this.emailInput.fill(email);
  }

  async fillMessage(message: string) {
    await this.messageInput.scrollIntoViewIfNeeded();
    await this.messageInput.fill(message);
  }

  async submit() {
    await this.submitButton.scrollIntoViewIfNeeded();
    await this.submitButton.click();
  }

  async expectThankYouMessage() {
    await expect(this.page.locator('text=Thank you')).toBeVisible();
  }

  async expectFieldsRequired() {
    await expect(this.nameInput).toHaveAttribute('required', '');
    await expect(this.emailInput).toHaveAttribute('required', '');
    await expect(this.messageInput).toHaveAttribute('required', '');
  }
}
