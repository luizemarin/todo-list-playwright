import { test, expect } from '../fixtures/tasks.fixture';

test.describe('API Error Handling', () => {
  test.beforeEach(async ({ taskListPage }) => {
    await taskListPage.navigate();
    await taskListPage.clearAllTasks();
  });

  test.afterEach(async ({ taskListPage }) => {
    await taskListPage.clearAllTasks();
  });

  test('should handle API error when fetching tasks (GET /tasks)', async ({
    page,
    taskListPage,
  }) => {
    await page.route('**/tasks', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Internal Server Error' }),
        });
      } else {
        await route.continue();
      }
    });

    const taskList = taskListPage.getTaskList();
    await expect(taskList).not.toBeVisible({ timeout: 5000 });
  });

  test('should handle API error when creating task (POST /tasks)', async ({
    page,
    taskFormPage,
    taskListPage,
  }) => {

    let createTaskCalled = false;
    await page.route('**/tasks', async (route) => {
      if (route.request().method() === 'POST') {
        createTaskCalled = true;
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Internal Server Error' }),
        });
      } else {
        await route.continue();
      }
    });

    await taskFormPage.createTask('Task that will fail');

    await expect.poll(() => createTaskCalled).toBeTruthy();

    const taskCount = await taskListPage.taskItemCount();
    expect(taskCount).toHaveCount(0);
  });

  test('should handle API error when deleting task (DELETE /tasks/*)', async ({
    page,
    taskFormPage,
    taskListPage,
  }) => {
    const taskTitle = `Task for delete error ${Date.now()}`;
    await taskFormPage.createTask(taskTitle);
    await taskListPage.waitForTaskToAppear(taskTitle);

    await page.route('**/tasks/*', async (route) => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Internal Server Error' }),
        });
      } else {
        await route.continue();
      }
    });

    await taskListPage.deleteTask(taskTitle);

    await page.waitForTimeout(1000);

    const isVisible = await taskListPage.isTaskVisible(taskTitle);
    expect(isVisible).toBeTruthy();
  });
});
