import { test, expect } from '../fixtures/tasks.fixture';

test.describe('Task Deletion', () => {
  const testTaskTitle = 'Test Task for Deletion';

  test.beforeEach(async ({ taskFormPage, taskListPage }) => {
    await taskListPage.clearAllTasks();
    await taskFormPage.createTask(testTaskTitle);
    await taskListPage.waitForTaskToAppear(testTaskTitle);
  });

  test.afterEach(async ({ taskListPage }) => {
    await taskListPage.clearAllTasks();
  });

  test('should delete a task', async ({ taskListPage }) => {
    await taskListPage.deleteTask(testTaskTitle);
    await taskListPage.waitForTaskToDisappear(testTaskTitle);

    const taskCount = await taskListPage.taskItemCount();
    expect(taskCount).toHaveCount(0);
  });

  test('should confirm task is not visible after deletion', async ({ taskListPage }) => {
    await taskListPage.deleteTask(testTaskTitle);
    await taskListPage.waitForTaskToDisappear(testTaskTitle);

    const isVisible = await taskListPage.isTaskVisible(testTaskTitle);
    expect(isVisible).toBeFalsy();
  });

  test('should delete only the selected task when multiple exist', async ({
    taskFormPage,
    taskListPage,
  }) => {
    const task2 = 'Second Task';
    await taskFormPage.createTask(task2);
    await taskListPage.waitForTaskToAppear(task2);

    await taskListPage.deleteTask(testTaskTitle);
    await taskListPage.waitForTaskToDisappear(testTaskTitle);

    const taskCount = await taskListPage.taskItemCount();
    expect(taskCount).toHaveCount(1);

    const isTask2Visible = await taskListPage.isTaskVisible(task2);
    expect(isTask2Visible).toBeTruthy();
  });

  test('should delete multiple tasks independently', async ({
    taskFormPage,
    taskListPage,
  }) => {
    const task2 = 'Second Task for Deletion';
    await taskFormPage.createTask(task2);
    await taskListPage.waitForTaskToAppear(task2);

    await taskListPage.deleteTask(testTaskTitle);
    await taskListPage.waitForTaskToDisappear(testTaskTitle);

    expect(await taskListPage.isTaskVisible(testTaskTitle)).toBeFalsy();
    expect(await taskListPage.isTaskVisible(task2)).toBeTruthy();

    await taskListPage.deleteTask(task2);
    await taskListPage.waitForTaskToDisappear(task2);

    const taskCount = await taskListPage.taskItemCount();
    expect(taskCount).toHaveCount(0);
  });

  test('should delete multiple tasks', async ({
    taskFormPage,
    taskListPage,
  }) => {
    const tasks = ['Task A', 'Task B', 'Task C'];
    for (const task of tasks) {
      await taskFormPage.createTask(task);
      await taskListPage.waitForTaskToAppear(task);
    }

    for (const task of tasks) {
      await taskListPage.deleteTask(task);
      await taskListPage.waitForTaskToDisappear(task);
    }

    const taskCount = await taskListPage.taskItemCount();
    expect(taskCount).toHaveCount(0);
  });
});
