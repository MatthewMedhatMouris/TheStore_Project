import supertest from 'supertest';
import app from '../..';
import Users from '../../types/user';
import { Users_DB } from '../../models/users';
import client from '../../database';

const request = supertest(app);
const userModel: Users_DB = new Users_DB();

describe('Test Product Endpoint ', () => {
    const user: Users = {
        s_name: 'admin',
        s_email: 'admin@gmail.com',
        s_password: '123',
    } as Users;

    let token = '';
    let product_id: string;

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
        const sql = `DELETE FROM users;
            DELETE FROM products;`;
        await conn.query(sql);
        conn.release();
    });



    it('Check Product Create Endpoint', async () => {

        const res = await request
            .post('/products')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                s_name: 'OPPO',
                s_description: 'testtest',
                n_price: 5000,
            });
        expect(res.status).toBe(200);
        expect(res.body.s_name).toBe('OPPO');
        product_id = res.body.id;
    });

    it('Check Product Index Endpoint', async () => {
        const res = await request
            .get(`/products`)
            .set('Content-type', 'application/json').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
    });

    it('Check Product GetOne Endpoint', async () => {
        const res = await request
            .get(`/products/${product_id}`)
            .set('Content-type', 'application/json').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.s_name).toBe('OPPO');
    });

    it('Check Product Update Endpoint', async () => {
        const res = await request
            .put(`/products`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id: product_id,
                s_name: 'Realme',
                s_description: 'test',
                n_price: 6000
            });
        expect(res.status).toBe(200);
        expect(res.body.s_name).toBe('Realme');
    });

    it('Check Product Delete Endpoint', async () => {
        const res = await request
            .delete(`/products`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id: product_id
            });
        expect(res.status).toBe(200);
    });

});