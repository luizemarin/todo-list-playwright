import { test, expect } from '../fixtures/tasks.fixture';

test.describe('Empty State', () => {
  test.beforeEach(async ({ taskListPage }) => {
    await taskListPage.navigate();
    await taskListPage.clearAllTasks();
  });

  test('should show empty when no tasks exists', async ({ taskListPage }) => {
    const taskCount = await taskListPage.taskItemCount();
    await expect(taskCount).not.toBeVisible();
  });

  test('should allow creating first task when list is empty', async ({
    taskFormPage,
    taskListPage,
  }) => {
    const firstTask = 'First Task in Empty List';
    await taskFormPage.createTask(firstTask);
    await taskListPage.waitForTaskToAppear(firstTask);

    const taskCount = await taskListPage.taskItemCount();
    expect(taskCount).not.toHaveCount(0);
  });

  test('should visible empty list after delete all tasks', async ({
    taskFormPage,
    taskListPage,
  }) => {
    await taskFormPage.createTask('Task to Delete');
    await taskListPage.waitForTaskToAppear('Task to Delete');

    let taskCount = await taskListPage.taskItemCount();
    expect(taskCount).toHaveCount(1);

    await taskListPage.deleteTask('Task to Delete');
    await taskListPage.waitForTaskToDisappear('Task to Delete');

    taskCount = await taskListPage.taskItemCount();
    expect(taskCount).toHaveCount(0);
  });
});
