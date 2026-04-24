import { Page, Locator, expect } from '@playwright/test';

export class TaskFormPage {
  readonly page: Page;
  readonly taskForm: Locator;
  readonly taskTitleInput: Locator;
  readonly taskSubmitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.taskForm = page.getByTestId('task-form');
    this.taskTitleInput = page.getByTestId('task-title-input');
    this.taskSubmitButton = page.getByTestId('task-submit-button');
  }

  async fillTitle(title: string) {
    await this.taskTitleInput.fill(title);
  }

  async clearTitle() {
    await this.taskTitleInput.clear();
  }

  async submit() {
    await this.taskSubmitButton.click();
  }

  async createTask(title: string) {
    await this.fillTitle(title);
    await this.submit();
  }

  async expectInputValue(expected: string) {
    await expect(this.taskTitleInput).toHaveValue(expected);
  }

  async expectInputCleared() {
    await expect(this.taskTitleInput).toHaveValue('');
  }

  async expectSubmitButtonDisabled() {
    await expect(this.taskSubmitButton).toBeDisabled();
  }

  async expectSubmitButtonEnabled() {
    await expect(this.taskSubmitButton).toBeEnabled();
  }
}
