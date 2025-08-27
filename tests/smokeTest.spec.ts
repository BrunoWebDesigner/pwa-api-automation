import { test } from '../utils/fixtures';
import { expect } from '../utils/custom-expect';
import { config } from '../utils/api-test-config';

// Pre-Request - It will executed before each test
let authToken: string

test.beforeAll('Get Token', async ({ api }) => {
    const tokenResponse = await api
        .path('/users/login')
        .body({"user":{"email":config.userEmail,"password":config.userPassword}})
        .postRequest(200);
    authToken = 'Token ' + tokenResponse.user.token;
});

test('Get Articles and Tags', async ({ api }) => {

    const response = await api
        .path('/articles')
        .params({limit:10, offset:0})
        .getRequest(200)
    expect(response.articles.length).toBeGreaterThan(0);
    expect(response.articles.length).toEqual(10);

    const response2 = await api
        .path('/tags')
        .getRequest(200)
    expect(response2.tags[0]).toEqual('Test')
    expect(response2.tags.length).toBeLessThanOrEqual(10)
})

test('Get Articles', async ({ api }) => {

    const response = await api
        .path('/articles')
        .params({limit:10, offset:0})
        .getRequest(200)
    expect(response.articles.length).toBeGreaterThan(0);
    expect(response.articles.length).toEqual(10);
})

test('Get Test Tags', async ({ api }) => {
    const response = await api
        .path('/tags')
        .getRequest(200)
    expect(response.tags[0]).toEqual('Test')
    expect(response.tags.length).toBeLessThanOrEqual(10)
})

test('Create and Delete Article', async ({ api }) => {
    // Create Article
    const createArticleResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .body({"article": {"title": "Test 02", "description": "Test Description 2", "body": "Test body", "tagList": []}})
        .postRequest(201);
    expect(createArticleResponse.article.title).toEqual('Test 02');
    const slugId = createArticleResponse.article.slug;

    // Verify Article Creation
    const articlesResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .params({limit:10, offset:0})
        .getRequest(200)
    expect(articlesResponse.articles[0].title).toEqual('Test 02');

    // Delete Article
    await api
        .path(`/articles/${slugId}`)
        .headers({ Authorization: authToken })
        .deleteRequest(204);

    // Verify Article Deletion
    const articlesResponseTwo = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .params({limit:10, offset:0})
        .getRequest(200)
    expect(articlesResponseTwo.articles[0].title).not.toEqual('Test 02');
})

test('Create, Update and Delete Article', async ({ api }) => {
    // Create Article
    const createArticleResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .body({"article": {"title": "Test 03", "description": "Test Description 2", "body": "Test body", "tagList": []}})
        .postRequest(201);
    expect(createArticleResponse.article.title).toEqual('Test 03');
    const slugId = createArticleResponse.article.slug;

    // Verify Article Creation
    const articlesResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .params({limit:10, offset:0})
        .getRequest(200)
    expect(articlesResponse.articles[0].title).toEqual('Test 03');

    // Update Article
    const updateArticleResponse = await api
        .path(`/articles/${slugId}`)
        .headers({ Authorization: authToken })
        .body({"article": {"title": "Test 03 Updated", "description": "Test Description 2", "body": "Test body", "tagList": []}})
        .putRequest(200);
    expect(updateArticleResponse.article.title).toEqual('Test 03 Updated');
    const updatedSlugId = updateArticleResponse.article.slug;

    // Verify Article Update
    const updatedArticleResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .params({limit:10, offset:0})
        .getRequest(200)
    expect(updatedArticleResponse.articles[0].title).toEqual('Test 03 Updated');

    // Delete Article
    await api
        .path(`/articles/${updatedSlugId}`)
        .headers({ Authorization: authToken })
        .deleteRequest(204);

    // Verify Article Deletion
    const articlesResponseTwo = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .params({limit:10, offset:0})
        .getRequest(200);
    expect(articlesResponseTwo.articles[0].title).not.toEqual('Test 03 Updated');
})