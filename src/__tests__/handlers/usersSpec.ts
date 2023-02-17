import supertest from 'supertest';
import app from '../..';
import Users from '../../types/user';
import { Users_DB } from '../../models/users';
import client from '../../database';

const request = supertest(app);
const userModel: Users_DB = new Users_DB();

describe('Test User Endpoint ', () => {
    const user: Users = {
        s_name: 'admin',
        s_email: 'admin@gmail.com',
        s_password: '123',
    } as Users;

    let token = '';
    let user_id: string;

    beforeAll(async () => {
        const currentUser = await userModel.create(user);
        user.id = currentUser?.id;

        const res = await request
            .post('/users/authenticate')
            .set('Content-type', 'application/json')
            .send(user);
        token = res.body;
    });

    afterAll(async () => {
        const conn = await client.connect();
        const sql = `DELETE FROM users;`;
        await conn.query(sql);
        conn.release();
    });


    it('Check User Create Endpoint', async () => {

        const res = await request
            .post('/users')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                s_name: 'Matthew',
                s_email: 'matthew@gmail.com',
                s_password: '123',
            });
        expect(res.status).toBe(200);
        expect(res.body.s_name).toBe('Matthew');
        user_id = res.body.id;
    });

    it('Check User Authenticate Endpoint', async () => {
        const res = await request
            .post(`/users/authenticate`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                s_name: 'Matthew',
                s_email: 'matthew@gmail.com',
                s_password: '123',
            });
        expect(res.status).toBe(200);
    });

    it('Check User Index Endpoint', async () => {
        const res = await request
            .get(`/users`)
            .set('Content-type', 'application/json').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
    });

    it('Check User GetOne Endpoint', async () => {
        const res = await request
            .get(`/users/${user_id}`)
            .set('Content-type', 'application/json').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.s_name).toBe('Matthew');
    });

    it('Check User Update Endpoint', async () => {
        const res = await request
            .put(`/users`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id: user_id,
                s_name: 'John',
                s_email: 'john@gmail.com',
                s_password: '123'
            });
        expect(res.status).toBe(200);
        expect(res.body.s_name).toBe('John');
    });


    it('Check User Delete Endpoint', async () => {
        const res = await request
            .delete(`/users`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id: user_id
            });
        expect(res.status).toBe(200);
    });

    
});