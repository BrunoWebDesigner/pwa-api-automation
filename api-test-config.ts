const processENV = process.env.TEST_ENV;
const env = processENV || 'dev';
console.log(`Running tests in ${env.toUpperCase()}`);

const config = {
    apiUrl: 'https://conduit-api.bondaracademy.com/api',
    userEmail: 'brunowebdeveloper33@gmail.com',
    userPassword: 'bondar27*'
};

// Examples for creating environment-specific configurations
if (env === 'qa') {
    config.userEmail = 'qa_user@example.com';
    config.userPassword = 'qa_password';
}

if (env === 'prod') {
    config.userEmail = 'prod_user@example.com';
    config.userPassword = 'prod_password';
}

export { config };