// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock window.crypto.randomUUID
const mockCrypto = {
  ...window.crypto,
  randomUUID: jest.fn().mockReturnValue('123e4567-e89b-12d3-a456-426614174000')
};

Object.defineProperty(window, 'crypto', {
  configurable: true,
  value: mockCrypto
});
