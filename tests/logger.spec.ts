import { test } from '../utils/fixtures';
import { expect } from '@playwright/test';
import { APILogger } from '../utils/logger.ts';


// Logger Test - Example to verify the logger created is working
test('Logger', () => {
    // First Logger
    const logger = new APILogger();
    logger.logRequest('POST', 'https://test.com/api', {Authorization: 'token'}, {foo: 'bar'});
    logger.logResponse(200, {foo: 'bar'});

    const logs = logger.getRecentLogs();
    console.log(logs);
    expect(logs).toContain('===Request Details===');
    expect(logs).toContain('===Response Details===');

    // Second Logger
    const logger2 = new APILogger();
    logger2.logRequest('GET', 'https://test.com/api', {Authorization: 'token'}, {foo: 'bar'});
    logger2.logResponse(200, {foo: 'bar'});

    const logs2 = logger2.getRecentLogs();
    console.log(logs2);
    expect(logs2).toContain('===Request Details===');
    expect(logs2).toContain('===Response Details===');
});