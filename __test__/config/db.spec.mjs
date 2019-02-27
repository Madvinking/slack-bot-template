require('dotenv').config();

import { DB } from '../../src/config/db';

const {
  MYSQL_TEST_HOST: host,
  MYSQL_TEST_USER: user,
  MYSQL_TEST_PORT: port,
  MYSQL_TEST_DATABASE: database,
  MYSQL_TEST_ROOT_PASSWORD: password
} = process.env;

const user1 = {
  id: 'userId1',
  team_id: 'teamId1',
  name: 'userName1',
  real_name: 'realName1',
  access_token: 'access_token1',
  scopes: 'scope1: hopa1, scope2:hopa2'
};

const user2 = {
  id: 'userId2',
  team_id: 'teamId2',
  name: 'userName2',
  real_name: 'realName2',
  access_token: 'access_token2',
  scopes: 'scope2: hopa2, scope2:hopa2'
};

let db;
describe('test the db connection', async () => {
  beforeAll(async () => {
    db = await DB({ host, user, port, database, password });
  });
  describe('user table:', async () => {
    test('save_user: success', async () => {
      const res = await db.users.save(user1);
      expect(res).toBe(true);
    });

    test('save_user: failed', async () => {
      try {
        await db.users.save();
      } catch (err) {
        expect(err.message).toEqual(`Cannot read property 'id' of undefined`);
      }
    });

    test('get_user: success', async () => {
      const user = await db.users.get(user1.id);
      expect(user).toMatchObject(user1);
    });

    test('get_user: not found', async () => {
      try {
        await db.users.get('noId');
      } catch (err) {
        expect(err.message).toEqual(`can't find noId in user`);
      }
    });

    test('get_user: error', async () => {
      try {
        await db.users.get();
      } catch (err) {
        expect(err.message).toEqual('must provide id');
      }
    });

    test('get_all_user: success', async () => {
      await db.users.save(user2);
      const users = await db.users.all();
      expect(users).toHaveLength(2);
      expect(users[0]).toMatchObject(user1);
      expect(users[1]).toMatchObject(user2);
    });
  });
});
