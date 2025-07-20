import { test, expect } from '@playwright/test';

test('Get Test Tags', async ({ request }) => {
  const tagsResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags')
  const tagsResponseJSON = await tagsResponse.json();
  
  expect(tagsResponse.status()).toBe(200);
  expect(tagsResponseJSON.tags[0]).toEqual('Test')
  expect(tagsResponseJSON.tags.length).toBeLessThanOrEqual(10)
  console.log(tagsResponseJSON)
});

test('Get All Articles', async ({ request }) => {
  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles')
  const articlesResponseJSON = await articlesResponse.json();
  
  expect(articlesResponse.status()).toBe(200);
  expect(articlesResponseJSON.articles.length).toBeGreaterThan(0);
  console.log(articlesResponseJSON)
});