const Room = require('../Room');
const Client = require('../Client');

jest.mock('../Client.js');

test('constructor', () => {
  const room = new Room('1234');
  expect(room.id).toBe('1234');
});

test('clients', () => {
  const room = new Room('1234');
  const client1 = new Client(null, null);
  const client2 = new Client(null, null);
  room.addClient(client1);
  room.addClient(client2);
  expect(() => room.addClient(client1)).toThrow();
  expect(() => room.addClient(client2)).toThrow();
  expect(room.getClients().size).toBe(2);
  expect(room.getClients().has(client1)).toBe(true);
  expect(room.getClients().has(client2)).toBe(true);
  room.removeClient(client1);
  expect(room.getClients().size).toBe(1);
  expect(room.getClients().has(client1)).toBe(false);
  expect(room.getClients().has(client2)).toBe(true);
  room.removeClient(client2);
  expect(room.getClients().size).toBe(0);
  expect(room.getClients().has(client1)).toBe(false);
  expect(room.getClients().has(client2)).toBe(false);
  expect(() => room.removeClient(client1)).toThrow();
  expect(() => room.removeClient(client2)).toThrow();
});

test('create', () => {
  const room = new Room('1234');
  expect(() => room.create('invalid name', '123')).toThrow();
  expect(() => room.create('☁ name', 'invalid value')).toThrow();
  room.create('☁ variable', '123');
  expect(() => room.create('☁ variable', '123')).toThrow();
});

test('maxVariables', () => {
  const room = new Room('1234');
  for (var i = 0; i < room.maxVariables; i++) {
    room.create('☁ variable' + i, '1234');
  }
  expect(() => room.create('☁ too many exist', '1234')).toThrow();
});

test('has', () => {
  const room = new Room('1234');
  expect(room.has('☁ foo')).toBe(false);
  expect(room.has('☁ bar')).toBe(false);
  room.create('☁ foo', '123');
  expect(room.has('☁ foo')).toBe(true);
  expect(room.has('☁ bar')).toBe(false);
  room.create('☁ bar', '123');
  expect(room.has('☁ foo')).toBe(true);
  expect(room.has('☁ bar')).toBe(true);
});

test('set', () => {
  const room = new Room('1234');
  expect(() => room.set('☁ doesnt exist', '123')).toThrow();
  expect(() => room.set('☁ foo', 'invalid value')).toThrow();
  expect(() => room.set('invalid name', '123')).toThrow();
  room.create('☁ foo', '123');
  room.create('☁ bar', '456');
  const vars = room.getAllVariables();
  expect(vars.size).toBe(2);
  expect(vars.get('☁ foo')).toBe('123');
  expect(vars.get('☁ bar')).toBe('456');
  room.set('☁ foo', '789');
  room.set('☁ bar', '123');
  const vars2 = room.getAllVariables();
  expect(vars2.size).toBe(2);
  expect(vars2.get('☁ foo')).toBe('789');
  expect(vars2.get('☁ bar')).toBe('123');
});

test('hasClientWithUsername', () => {
  const room = new Room('1234');
  const client1 = new Client(null, null);
  client1.username = 'username';
  const client2 = new Client(null, null);
  client2.username = 'username2';
  expect(room.hasClientWithUsername('username')).toBe(false);
  expect(room.hasClientWithUsername('username2')).toBe(false);
  room.addClient(client1);
  expect(room.hasClientWithUsername('username')).toBe(true);
  expect(room.hasClientWithUsername('username2')).toBe(false);
  room.addClient(client2);
  expect(room.hasClientWithUsername('username')).toBe(true);
  expect(room.hasClientWithUsername('username2')).toBe(true);
});

test('matchesVariableList', () => {
  const room = new Room('1234');
  expect(room.matchesVariableList([])).toBe(true);
  expect(room.matchesVariableList(['not even a cloud variable'])).toBe(false);
  expect(room.matchesVariableList(['☁ foo'])).toBe(false);
  expect(room.matchesVariableList(['☁ Foo'])).toBe(false);
  expect(room.matchesVariableList(['☁ foo', '☁ bar'])).toBe(false);
  expect(room.matchesVariableList(['☁ bar', '☁ foo'])).toBe(false);
  expect(room.matchesVariableList(['☁ bar', '☁ foo', '☁ fizz'])).toBe(false);
  room.create('☁ foo', '123');
  expect(room.matchesVariableList([])).toBe(false);
  expect(room.matchesVariableList(['☁ foo'])).toBe(true);
  expect(room.matchesVariableList(['☁ Foo'])).toBe(false);
  expect(room.matchesVariableList(['☁ foo', '☁ foo'])).toBe(false);
  expect(room.matchesVariableList(['☁ foo', '☁ bar'])).toBe(false);
  expect(room.matchesVariableList(['☁ bar', '☁ foo'])).toBe(false);
  expect(room.matchesVariableList(['☁ bar', '☁ foo', '☁ fizz'])).toBe(false);
  room.create('☁ bar', '123');
  expect(room.matchesVariableList([])).toBe(false);
  expect(room.matchesVariableList(['☁ foo'])).toBe(false);
  expect(room.matchesVariableList(['☁ foo', 'not even a cloud variable'])).toBe(false);
  expect(room.matchesVariableList(['☁ foo', '☁ foo'])).toBe(false);
  expect(room.matchesVariableList(['☁ foo', '☁ bar'])).toBe(true);
  expect(room.matchesVariableList(['☁ bar', '☁ foo'])).toBe(true);
  expect(room.matchesVariableList(['☁ bar', '☁ foo', '☁ fizz'])).toBe(false);
});

test('maxClients', () => {
  const room = new Room('1234');
  room.maxClients = 10;
  for (var i = 0; i < room.maxClients; i++) {
    room.addClient(new Client(null, null));
  }
  expect(() => room.addClient(new Client(null, null))).toThrow();
});
