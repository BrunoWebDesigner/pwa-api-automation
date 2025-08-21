import { test } from '../utils/fixtures';

test('smoke test', async ({ api }) => {

    api
        .url('https://conduit-api.bondaracademy.com/api/articles')
        .path('/articles')
        .params({limit:10, offset:0})
        .headers({Authorization: 'authToken'})
        .body({"user":{"email":"brunowebdeveloper33@gmail.com","password":"bondar27*"}})
})