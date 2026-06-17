import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateLead } from '../lib/validate.js';

test('rechaza objeto vacío con todos los errores', () => {
  const { valid, errors } = validateLead({});
  assert.equal(valid, false);
  assert.ok(errors.name);
  assert.ok(errors.email);
  assert.ok(errors.company);
  assert.ok(errors.industry);
  assert.ok(errors.challenge);
});

test('rechaza email mal formado', () => {
  const { valid, errors } = validateLead({
    name: 'Ana',
    email: 'ana-arroba-mail',
    company: 'Mi PYME',
    industry: 'retail',
    challenge: 'Vender más',
  });
  assert.equal(valid, false);
  assert.ok(errors.email);
});

test('acepta un lead completo y válido', () => {
  const { valid, errors } = validateLead({
    name: 'Ana Torres',
    email: 'ana@miempresa.pe',
    company: 'Mi PYME',
    industry: 'retail',
    challenge: 'Quiero automatizar la atención por WhatsApp',
  });
  assert.equal(valid, true);
  assert.deepEqual(errors, {});
});

test('el teléfono es opcional', () => {
  const base = {
    name: 'Ana',
    email: 'ana@x.pe',
    company: 'X',
    industry: 'servicios',
    challenge: 'Reducir tiempos',
  };
  assert.equal(validateLead(base).valid, true);
  assert.equal(validateLead({ ...base, phone: '999888777' }).valid, true);
});

test('rechaza campos solo con espacios en blanco', () => {
  const { valid, errors } = validateLead({
    name: '   ',
    email: 'ana@x.pe',
    company: 'X',
    industry: 'servicios',
    challenge: 'algo',
  });
  assert.equal(valid, false);
  assert.ok(errors.name);
});
