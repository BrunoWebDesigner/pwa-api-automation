import { test, expect } from '@playwright/test';

// How to get a tags
test('Get Test Tags', async ({ request }) => {
  const tagsResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags')
  const tagsResponseJSON = await tagsResponse.json();
  
  expect(tagsResponse.status()).toBe(200);
  expect(tagsResponseJSON.tags[0]).toEqual('Test')
  expect(tagsResponseJSON.tags.length).toBeLessThanOrEqual(10)
  console.log(tagsResponseJSON)
});

// How to get all articles
test('Get All Articles', async ({ request }) => {
  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles')
  const articlesResponseJSON = await articlesResponse.json();
  
  expect(articlesResponse.status()).toBe(200);
  expect(articlesResponseJSON.articles.length).toBeGreaterThan(0);
  expect(articlesResponseJSON.articles.length).toBeLessThanOrEqual(10);
  expect(articlesResponseJSON.articlesCount).toEqual(10);
  console.log(articlesResponseJSON)
});

// How to create a post request test with authentication
test('Create and Delete Article', async ({ request }) => {
  const tokenResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {"user":{"email":"brunowebdeveloper33@gmail.com","password":"bondar27*"}}
  });
  const tokenResponseJSON = await tokenResponse.json();
  const authToken = tokenResponseJSON.user.token;

  const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles', {
    data: {
      "article": {
          "title": "Test 02",
          "description": "Test Description 2",
          "body": "Test body",
          "tagList": []
      }
    },
    headers: {
      'Authorization': `Token ${authToken}`
    }
  })
  const newArticleResponseJSON = await newArticleResponse.json();
  console.log(newArticleResponseJSON);
  expect(newArticleResponse.status()).toBe(201);
  expect(newArticleResponseJSON.article.title).toEqual('Test 02');
  const slugId = newArticleResponseJSON.article.slug;

  // Verify the article was created
  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles', {
    headers: {
      'Authorization': `Token ${authToken}`
    }
  })
  const articlesResponseJSON = await articlesResponse.json();
  expect(articlesResponse.status()).toBe(200);
  expect(articlesResponseJSON.articles[0].title).toEqual('Test 02');

  // Delete the article
  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
    headers: {
      'Authorization': `Token ${authToken}`
    }
  });
  expect(deleteArticleResponse.status()).toBe(204);
});

