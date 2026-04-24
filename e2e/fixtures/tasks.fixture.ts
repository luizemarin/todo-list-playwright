import { test as base } from '@playwright/test';
import { TaskListPage } from '../pages/TaskListPage';
import { TaskFormPage } from '../pages/TaskFormPage';

export type TodoListFixture = {
  taskListPage: TaskListPage;
  taskFormPage: TaskFormPage;
};

export const test = base.extend<TodoListFixture>({
  taskListPage: async ({ page }, use) => {
    const taskListPage = new TaskListPage(page);
    await taskListPage.navigate();
    await use(taskListPage);
  },

  taskFormPage: async ({ page }, use) => {
    const taskFormPage = new TaskFormPage(page);
    await use(taskFormPage);
  },
});

export { expect } from '@playwright/test';
