import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isValidEmail } from '../lib/validate.js';

test('acepta emails válidos', () => {
  assert.equal(isValidEmail('ana@miempresa.pe'), true);
  assert.equal(isValidEmail('  juan.perez@correo.com  '), true);
});

test('rechaza emails inválidos', () => {
  assert.equal(isValidEmail('ana-arroba-mail'), false);
  assert.equal(isValidEmail('ana@'), false);
  assert.equal(isValidEmail('@correo.com'), false);
  assert.equal(isValidEmail('ana@correo'), false);
  assert.equal(isValidEmail(''), false);
});

test('rechaza valores no-string', () => {
  assert.equal(isValidEmail(null), false);
  assert.equal(isValidEmail(undefined), false);
  assert.equal(isValidEmail(123), false);
});
