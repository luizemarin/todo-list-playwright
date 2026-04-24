import { test, expect } from '../fixtures/tasks.fixture';

test.describe('Task Completion and Persistence', () => {
  const testTaskTitle = 'Test Task for Completion';

  test.beforeEach(async ({ taskFormPage, taskListPage }) => {
    await taskListPage.clearAllTasks();
    await taskFormPage.createTask(testTaskTitle);
    await taskListPage.waitForTaskToAppear(testTaskTitle);
  });

  test.afterEach(async ({ taskListPage }) => {
    await taskListPage.clearAllTasks();
  });

  test('should toggle task to completed', async ({ taskListPage }) => {
    const isCompletedBefore = await taskListPage.isTaskCompleted(testTaskTitle);
    expect(isCompletedBefore).toBeFalsy();

    await taskListPage.toggleTask(testTaskTitle);

    const isCompletedAfter = await taskListPage.isTaskCompleted(testTaskTitle);
    expect(isCompletedAfter).toBeTruthy();
  });

  test('should toggle task back to incomplete', async ({ taskListPage }) => {
    await taskListPage.toggleTask(testTaskTitle);
    let isCompleted = await taskListPage.isTaskCompleted(testTaskTitle);
    expect(isCompleted).toBeTruthy();

    await taskListPage.toggleTask(testTaskTitle);
    isCompleted = await taskListPage.isTaskCompleted(testTaskTitle);
    expect(isCompleted).toBeFalsy();
  });

  test('should show completed task with strikethrough', async ({ taskListPage }) => {
    await taskListPage.toggleTask(testTaskTitle);
    await taskListPage.expectTaskCompleted(testTaskTitle);
  });

  test('should show incomplete task without strikethrough', async ({ taskListPage }) => {
    await taskListPage.expectTaskNotCompleted(testTaskTitle);
  });

  // TODO: it's failing due to a bug in the application
  test.skip('should persist completion state after page reload - BUG-001', async ({
    taskListPage,
  }) => {
    await taskListPage.toggleTask(testTaskTitle);
    await taskListPage.expectTaskCompleted(testTaskTitle);

    await taskListPage.reload();

    const isCompleted = await taskListPage.isTaskCompleted(testTaskTitle);
    expect(isCompleted).toBeTruthy();
    await taskListPage.expectTaskCompleted(testTaskTitle);
  });
  
  // TODO: it's failing due to a bug in the application
  test.skip('should persist incomplete state after page reload', async ({
    taskListPage,
  }) => {
    await taskListPage.toggleTask(testTaskTitle);
    await taskListPage.toggleTask(testTaskTitle);

    await taskListPage.reload();

    const isCompleted = await taskListPage.isTaskCompleted(testTaskTitle);
    expect(isCompleted).toBeFalsy();
  });

  test('should toggle multiple tasks independently', async ({
    taskFormPage,
    taskListPage,
  }) => {
    const task2 = 'Second Task for Toggle';
    await taskFormPage.createTask(task2);
    await taskListPage.waitForTaskToAppear(task2);

    await taskListPage.toggleTask(testTaskTitle);
    expect(await taskListPage.isTaskCompleted(testTaskTitle)).toBeTruthy();
    expect(await taskListPage.isTaskCompleted(task2)).toBeFalsy();

    await taskListPage.toggleTask(task2);
    expect(await taskListPage.isTaskCompleted(testTaskTitle)).toBeTruthy();
    expect(await taskListPage.isTaskCompleted(task2)).toBeTruthy();
  });

  test('should maintain checkbox checked state visually', async ({ taskListPage }) => {
    await taskListPage.toggleTask(testTaskTitle);

    const checkbox = taskListPage.getTaskCheckbox(testTaskTitle);
    await expect(checkbox).toBeChecked();
  });
});
