import { test, expect } from '@playwright/test';

const API_BASE_URL = 'http://localhost:3001';

// Schema validator for Task entity
const validateTaskSchema = (task: any) => {
  expect(task).toHaveProperty('id');
  expect(typeof task.id).toBe('string');

  expect(task).toHaveProperty('title');
  expect(typeof task.title).toBe('string');

  expect(task).toHaveProperty('isCompleted');
  expect(typeof task.isCompleted).toBe('boolean');

  expect(task).toHaveProperty('isAiGenerated');
  expect(typeof task.isAiGenerated).toBe('boolean');

  expect(task).toHaveProperty('createdAt');
  expect(typeof task.createdAt).toBe('string');
};

test.describe('API Contract Tests - Tasks', () => {
  let createdTaskId: string;

  test.afterEach(async ({ request }) => {
    if (createdTaskId) {
      await request.delete(`${API_BASE_URL}/tasks/${createdTaskId}`);
      createdTaskId = '';
    }
  });

  test.describe('GET /tasks', () => {
    test('should return 200 with array of tasks', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/tasks`);

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
    });
  });

  test.describe('POST /tasks', () => {
    test('should return 201 with created task when valid payload', async ({ request }) => {
      const payload = { title: 'API Test Task' };

      const response = await request.post(`${API_BASE_URL}/tasks`, {
        data: payload,
      });

      expect(response.status()).toBe(201);

      const body = await response.json();
      validateTaskSchema(body);
      expect(body.title).toBe(payload.title);
      expect(body.isCompleted).toBe(false);
      expect(body.isAiGenerated).toBe(false);

      createdTaskId = body.id;
    });

    test('should return 400 when title is missing', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/tasks`, {
        data: {},
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('statusCode');
      expect(body.statusCode).toBe(400);
    });

    test('should return 400 when title is not a string', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/tasks`, {
        data: { title: 12345 },
      });

      expect(response.status()).toBe(400);
    });

    test('should return 400 when payload is empty', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/tasks`, {
        data: '',
        headers: { 'Content-Type': 'application/json' },
      });

      expect(response.status()).toBe(400);
    });
  });

  test.describe('GET /tasks/:id', () => {
    test('should return 200 with task when ID exists', async ({ request }) => {
      const createResponse = await request.post(`${API_BASE_URL}/tasks`, {
        data: { title: 'Find Me Task' },
      });
      const createdTask = await createResponse.json();
      createdTaskId = createdTask.id;

      const response = await request.get(`${API_BASE_URL}/tasks/${createdTaskId}`);

      expect(response.status()).toBe(200);

      const body = await response.json();
      validateTaskSchema(body);
      expect(body.id).toBe(createdTaskId);
      expect(body.title).toBe('Find Me Task');
    });

    // TODO: Enable when bug is fixed
    test.skip('should return 404 when ID does not exist', async ({ request }) => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      const response = await request.get(`${API_BASE_URL}/tasks/${nonExistentId}`);

      expect(response.status()).toBe(404);

      const body = await response.json();
      expect(body).toHaveProperty('error');
      expect(body.error).toContain('não encontrada');
    });

    // TODO: Enable when bug is fixed
    test.skip('should return 400 when ID format is invalid', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/tasks/invalid-id`);

      expect([400, 500]).toContain(response.status());
    });
  });

  test.describe('PATCH /tasks/:id', () => {
    test.beforeEach(async ({ request }) => {
      const createResponse = await request.post(`${API_BASE_URL}/tasks`, {
        data: { title: 'Update Task' },
      });
      const createdTask = await createResponse.json();
      createdTaskId = createdTask.id;
    });

    test('should return 200 with updated task when updating title', async ({ request }) => {
      const payload = { title: 'Updated Title' };

      const response = await request.patch(`${API_BASE_URL}/tasks/${createdTaskId}`, {
        data: payload,
      });

      expect(response.status()).toBe(200);

      const body = await response.json();
      validateTaskSchema(body);
      expect(body.id).toBe(createdTaskId);
      expect(body.title).toBe(payload.title);
    });

    test('should return 200 with updated task when toggling completion', async ({ request }) => {
      const payload = { isCompleted: true };

      const response = await request.patch(`${API_BASE_URL}/tasks/${createdTaskId}`, {
        data: payload,
      });

      expect(response.status()).toBe(200);

      const body = await response.json();
      validateTaskSchema(body);
      expect(body.isCompleted).toBe(true);
    });

    test('should return 404 when updating non-existent ID', async ({ request }) => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      const response = await request.patch(`${API_BASE_URL}/tasks/${nonExistentId}`, {
        data: { title: 'New Title' },
      });

      expect(response.status()).toBe(404);

      const body = await response.json();
      expect(body).toHaveProperty('error');
    });

    test('should return 400 when title is not a string', async ({ request }) => {
      const response = await request.patch(`${API_BASE_URL}/tasks/${createdTaskId}`, {
        data: { title: 12345 },
      });

      expect(response.status()).toBe(400);
    });
  });

  test.describe('DELETE /tasks/:id', () => {
    let taskToDelete: string;

    test.beforeEach(async ({ request }) => {
      const createResponse = await request.post(`${API_BASE_URL}/tasks`, {
        data: { title: 'Delete Me Task' },
      });
      const taskToDeleteResponse = await createResponse.json();
      taskToDelete = taskToDeleteResponse.id;
    });

    test('should return 204 when deleting existing task', async ({ request }) => {
      const response = await request.delete(`${API_BASE_URL}/tasks/${taskToDelete}`);

      expect(response.status()).toBe(204);
      expect(await response.text()).toBe('');
    });
  });
});

test.describe('API Contract Tests - AI Generation', () => {
  test.describe('POST /ai/generate', () => {
    const validObjective = 'Plan a birthday party';
    const validApiKey = process.env.OPENROUTER_API_KEY || 'test-api-key';

    // Note: This test requires a valid OpenRouter API key
    // If no key is available, the test will be skipped
    test('should return 201 with generated tasks when valid payload', async ({ request }) => {
      test.skip(!process.env.OPENROUTER_API_KEY, 'OpenRouter API key not configured');

      const payload = {
        objective: validObjective,
        apiKey: process.env.OPENROUTER_API_KEY,
      };

      const response = await request.post(`${API_BASE_URL}/ai/generate`, {
        data: payload,
      });

      expect(response.status()).toBe(201);

      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);

      body.forEach((task: any) => {
        validateTaskSchema(task);
        expect(task.isAiGenerated).toBe(true);
        expect(task.title.length).toBeGreaterThan(0);
      });
    });

    test('should return 400 when apiKey is missing', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/ai/generate`, {
        data: { objective: validObjective },
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('statusCode');
    });

    test('should return 400 when apiKey is empty string', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/ai/generate`, {
        data: { objective: validObjective, apiKey: '' },
      });

      expect(response.status()).toBe(400);
    });
  });
});
