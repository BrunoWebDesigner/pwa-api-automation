import { test, expect } from '@playwright/test';

let authToken: string;

test.beforeAll('run before all tests', async ({ request }) => {
  const tokenResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
  data: {"user":{"email":"brunowebdeveloper33@gmail.com","password":"bondar27*"}}
  });
  const tokenResponseJSON = await tokenResponse.json();
  authToken = 'Token ' + tokenResponseJSON.user.token;
});

// How to get a tags
test('Get Test Tags', async ({ request }) => {
  const tagsResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags')
  const tagsResponseJSON = await tagsResponse.json();
  
  expect(tagsResponse.status()).toBe(200);
  expect(tagsResponseJSON.tags[0]).toEqual('Test')
  expect(tagsResponseJSON.tags.length).toBeLessThanOrEqual(10)
});

// How to get all articles
test('Get All Articles', async ({ request }) => {
  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles')
  const articlesResponseJSON = await articlesResponse.json();
  
  expect(articlesResponse.status()).toBe(200);
  expect(articlesResponseJSON.articles.length).toBeGreaterThan(0);
  expect(articlesResponseJSON.articles.length).toBeLessThanOrEqual(10);
});

// How to create a post request test with authentication
test('Create and Delete Article', async ({ request }) => {
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
      Authorization: authToken
    }
  })
  const newArticleResponseJSON = await newArticleResponse.json();
  expect(newArticleResponse.status()).toBe(201);
  expect(newArticleResponseJSON.article.title).toEqual('Test 02');
  const slugId = newArticleResponseJSON.article.slug;
  console.log('Article created successfully');

  // Verify the article was created
  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles', {
    headers: {
      Authorization: authToken
    }
  })
  const articlesResponseJSON = await articlesResponse.json();
  expect(articlesResponse.status()).toBe(200);
  const foundArticle = articlesResponseJSON.articles.find(
    (article) => article.title === 'Test 02'
  );
  expect(foundArticle).toBeTruthy();
  expect(foundArticle.title).toEqual('Test 02');
  console.log('Article created successfully');

  // Delete the article
  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
    headers: {
      Authorization: authToken
    }
  });
  expect(deleteArticleResponse.status()).toBe(204);
  console.log('Article deleted successfully');
});

// How to create a post request test with authentication
test('Create, Update and Delete Article', async ({ request }) => {
  const updatedArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles', {
    data: {
      "article": {
          "title": "Test New Article",
          "description": "Test Description 2",
          "body": "Test body",
          "tagList": []
      }
    },
    headers: {
      Authorization: authToken
    }
  })
  const updatedArticleResponseJSON = await updatedArticleResponse.json();
  expect(updatedArticleResponse.status()).toBe(201);
  expect(updatedArticleResponseJSON.article.title).toEqual('Test New Article');
  const slugId2 = updatedArticleResponseJSON.article.slug;

  // Verify the article was created
  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles', {
    headers: {
      Authorization: authToken
    }
  })
  const articlesResponseJSON = await articlesResponse.json();
  expect(articlesResponse.status()).toBe(200);
  console.log('Article created successfully');
  const foundArticle = articlesResponseJSON.articles.find(
    (article) => article.title === 'Test New Article'
  );
  expect(foundArticle).toBeTruthy();
  expect(foundArticle.title).toEqual('Test New Article');

  // Update the article
  const updateArticleResponse = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${slugId2}`, {
    data: {
      "article": {
          "title": "Test New Article Updated",
          "description": "Test Description Updated",
          "body": "Test body Updated",
          "tagList": []
      }
    },
    headers: {
      Authorization: authToken
    }
  });
  const updateArticleResponseJSON = await updateArticleResponse.json();
  const newSlugId2 = updateArticleResponseJSON.article.slug;
  expect(updateArticleResponse.status()).toBe(200);
  console.log('Article updated successfully');
  expect(updateArticleResponseJSON.article.title).toEqual('Test New Article Updated');

  // Delete the article
  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${newSlugId2}`, {
    headers: {
      Authorization: authToken
    }
  });
  expect(deleteArticleResponse.status()).toBe(204);
  console.log('Article deleted successfully');
});