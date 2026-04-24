import { Page, expect } from '@playwright/test';

export class TaskListPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/');
  }

  async reload() {
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
  }

  getTaskList() {
    return this.page.getByTestId('task-list');
  }

  getTaskItem(title: string) {
    return this.page.getByTestId('task-item').filter({ hasText: title });
  }

  getTaskCheckbox(title: string) {
    return this.getTaskItem(title).getByTestId('task-checkbox');
  }

  getTaskDeleteButton(title: string) {
    return this.getTaskItem(title).getByTestId('task-delete-button');
  }

  getTaskTitleSpan(title: string) {
    return this.getTaskItem(title).getByTestId('task-title');
  }

  async toggleTask(title: string) {
    await this.getTaskCheckbox(title).click();
  }

  async deleteTask(title: string) {
    await this.getTaskDeleteButton(title).click();
  }

  async taskItemCount() {
    return this.page.getByTestId('task-item');
  }

  async isTaskVisible(title: string) {
    return await this.getTaskItem(title).isVisible();
  }

  async isTaskCompleted(title: string) {
    return await this.getTaskCheckbox(title).isChecked();
  }

  async waitForTaskToAppear(title: string) {
    await expect(this.getTaskItem(title)).toBeVisible();
  }

  async waitForTaskToDisappear(title: string) {
    await expect(this.getTaskItem(title)).not.toBeVisible();
  }

  async expectTaskCompleted(title: string) {
    const titleSpan = this.getTaskTitleSpan(title);
    await expect(titleSpan).toHaveCSS('text-decoration', /line-through/);
  }

  async expectTaskNotCompleted(title: string) {
    const titleSpan = this.getTaskTitleSpan(title);
    await expect(titleSpan).not.toHaveCSS('text-decoration', /line-through/);
  }

  async clearAllTasks() {
    const deleteButtons = await this.page.getByTestId('task-delete-button').all();
    const count = deleteButtons.length;
    for (let i = 0; i < count; i++) {
      const buttons = await this.page.getByTestId('task-delete-button').all();
      if (buttons.length > 0) {
        await buttons[0].click();
        await this.page.waitForTimeout(300);
      }
    }
  }

  async mockApiError(endpoint: string, method: string = 'GET') {
    await this.page.route(`**/${endpoint}`, async (route) => {
      if (route.request().method() === method) {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Internal Server Error' }),
        });
      } else {
        await route.continue();
      }
    });
  }

  async mockApiDelay(endpoint: string, delayMs: number = 2000) {
    await this.page.route(`**/${endpoint}`, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      await route.continue();
    });
  }
}
