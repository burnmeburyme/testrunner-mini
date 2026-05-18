// 🧪 example.test.js — Sample tests for testrunner-mini
const { test, expect, describe, skip } = require('./src/runner');

describe('Math operations', () => {
  test('adds two numbers', () => {
    expect(1 + 1).toBe(2);
  });

  test('subtracts correctly', () => {
    expect(10 - 4).toBe(6);
  });

  test('multiplies correctly', () => {
    expect(3 * 4).toBe(12);
  });

  test('handles floating point', () => {
    expect(Math.round(0.1 + 0.2 * 10)).toBe(2);
  });
});

describe('String operations', () => {
  test('converts to uppercase', () => {
    expect('hello'.toUpperCase()).toBe('HELLO');
  });

  test('contains substring', () => {
    expect('testrunner-mini').toContain('runner');
  });

  test('has correct length', () => {
    expect('abc'.length).toBe(3);
  });
});

describe('Async support', () => {
  test('resolves a promise', async () => {
    const result = await Promise.resolve(42);
    expect(result).toBe(42);
  });

  test('handles async errors', async () => {
    const fetchMock = async () => ({ status: 200, data: 'ok' });
    const res = await fetchMock();
    expect(res.status).toBe(200);
  });
});

describe('Skipped tests', () => {
  skip('this feature is not implemented yet');
});
