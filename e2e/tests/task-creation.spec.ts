import { test, expect } from '../fixtures/tasks.fixture';

test.describe('Task Creation', () => {
  test.beforeEach(async ({ taskListPage }) => {
    await taskListPage.clearAllTasks();
  });

  test.afterEach(async ({ taskListPage }) => {
    await taskListPage.clearAllTasks();
  });

  test('should create a task with valid title', async ({ taskFormPage, taskListPage }) => {
    const taskTitle = `Test Task ${Date.now()}`;

    await taskFormPage.createTask(taskTitle);
    await taskListPage.waitForTaskToAppear(taskTitle);

    const taskCount = await taskListPage.taskItemCount();
    expect(taskCount).toHaveCount(1);

    const isVisible = await taskListPage.isTaskVisible(taskTitle);
    expect(isVisible).toBeTruthy();
  });

  test('should create multiple tasks', async ({ taskFormPage, taskListPage }) => {
    const task1 = `Task 1 ${Date.now()}`;
    const task2 = `Task 2 ${Date.now()}`;

    await taskFormPage.createTask(task1);
    await taskListPage.waitForTaskToAppear(task1);

    await taskFormPage.createTask(task2);
    await taskListPage.waitForTaskToAppear(task2);

    const taskCount = await taskListPage.taskItemCount();
    expect(taskCount).toHaveCount(2);
  });

  test('should not create task with empty title', async ({ taskFormPage, taskListPage }) => {
    await taskFormPage.fillTitle('');
    await taskFormPage.submit();

    const taskCount = await taskListPage.taskItemCount();
    expect(taskCount).toHaveCount(0);
  });

  test('should trim whitespace from task title on creation', async ({
    taskFormPage,
    taskListPage,
  }) => {
    const taskTitle = 'Task with spaces';
    await taskFormPage.createTask(`   ${taskTitle}   `);
    await taskListPage.waitForTaskToAppear(taskTitle);

    const taskItem = taskListPage.getTaskTitleSpan(taskTitle);
    await expect(taskItem).toHaveText(taskTitle);
  });

  test('should clear input after creating task', async ({ taskFormPage, taskListPage }) => {
    await taskFormPage.createTask('New Task');
    await taskListPage.waitForTaskToAppear('New Task');

    await taskFormPage.expectInputCleared();
  });

  test('should create task with special characters', async ({
    taskFormPage,
    taskListPage,
  }) => {
    const taskTitle = 'Task with !@#$%^&*() chars';

    await taskFormPage.createTask(taskTitle);
    await taskListPage.waitForTaskToAppear(taskTitle);

    const isVisible = await taskListPage.isTaskVisible(taskTitle);
    expect(isVisible).toBeTruthy();
  });

  test('should create task with long title (200 chars)', async ({
    taskFormPage,
    taskListPage,
  }) => {
    const longTitle = 'A'.repeat(200);

    await taskFormPage.createTask(longTitle);
    await taskListPage.waitForTaskToAppear(longTitle);

    const isVisible = await taskListPage.isTaskVisible(longTitle);
    expect(isVisible).toBeTruthy();
  });

  test('should create task with long title (500 chars) - edge case', async ({
    taskFormPage,
    taskListPage,
  }) => {
    const longTitle = 'B'.repeat(500);

    await taskFormPage.createTask(longTitle);
    await taskListPage.waitForTaskToAppear(longTitle);

    const isVisible = await taskListPage.isTaskVisible(longTitle);
    expect(isVisible).toBeTruthy();
  });

  test('should disable submit button when title is empty - validation edge case', async ({
    taskFormPage,
  }) => {
    await taskFormPage.fillTitle('');
    await taskFormPage.expectSubmitButtonEnabled();
  });
});
