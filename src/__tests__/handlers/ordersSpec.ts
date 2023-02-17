import supertest from 'supertest';
import app from '../..';
import Users from '../../types/user';
import { Users_DB } from '../../models/users';
import client from '../../database';
import { Products_DB } from '../../models/products';
import { Orders_DB } from '../../models/orders';
import Products from '../../types/product';
import Orders from '../../types/order';
import OrderProducts from '../../types/orderProduct';


const request = supertest(app);
const userModel: Users_DB = new Users_DB();
const productModel: Products_DB = new Products_DB();
const orderModel: Orders_DB = new Orders_DB();

describe('Test Order Endpoint ', () => {
    const user: Users = {
        s_name: 'admin',
        s_email: 'admin@gmail.com',
        s_password: '123',
    } as Users;

    const product: Products = {
        s_name: 'OPPO',
        s_description: 'test test',
        n_price: 6000,
    } as Products;

    const product2: Products = {
        s_name: 'Realme',
        s_description: 'test test',
        n_price: 5000,
    } as Products;

    let order: Orders;
    let orderProducts: OrderProducts[];

    let token = '';

    beforeAll(async () => {
        const currentUser = await userModel.create(user);
        user.id = currentUser?.id;

        const res = await request
            .post('/users/authenticate')
            .set('Content-type', 'application/json')
            .send(user);
        token = res.body;

        const currentProduct1 = await productModel.create(product);
        product.id = currentProduct1.id;

        const currentProduct2 = await productModel.create(product2);
        product2.id = currentProduct2.id;

        order = {
            d_date: '2021-01-13',
            n_total_price: '6000',
            s_user_id: user.id,
            b_status: false,
        } as unknown as Orders;

        orderProducts = [{
            s_order_id: order.id as string,
            s_product_id: product.id as string,
            n_quantity: 1,
        }] as OrderProducts[];


        const currentOrder = await orderModel.create(order, orderProducts);
        order.id = currentOrder.id;
    });

    afterAll(async () => {
        const conn = await client.connect();
        const sql = `DELETE FROM orders;
                DELETE FROM products;
                DELETE FROM order_products;
                DELETE FROM users;`;
        await conn.query(sql);
        conn.release();
    });


    it('Check Orders Create Endpoint', async () => {
        const res = await request
            .post('/orders')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                d_date: '2021-01-13',
                n_total_price: '6000',
                s_user_id: user.id,
                b_status: false,
                orderProducts: [{
                    s_product_id: product.id as string,
                    n_quantity: 1,
                }, {
                    s_product_id: product2.id as string,
                    n_quantity: 1,
                }]
            });
        expect(res.status).toBe(200);
        expect(res.body.s_user_id).toBe(user.id);
    });


    it('Check Order Index Endpoint', async () => {
        const res = await request
            .get(`/orders`)
            .set('Content-type', 'application/json').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
    });

    it('Check Order GetOne Endpoint', async () => {
        const res = await request
            .get(`/orders/${order.id}`)
            .set('Content-type', 'application/json').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.s_user_name).toBe('admin');
    });

    it('Check Order CurrentOrder Endpoint', async () => {
        const res = await request
            .get(`/currentOrder`)
            .set('Content-type', 'application/json').set('Authorization', `Bearer ${token}`)
            .send({
                "id": order.id,
                "userId": user.id
            });
        expect(res.status).toBe(200);
        expect(res.body.s_user_name).toBe('admin');
    });

    

    it('Check Order ConfirmOrder Endpoint', async () => {
        const res = await request
            .patch(`/confirmOrder`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                "id": order.id,
                "s_user_id": user.id,
                "b_status": true
            });
        expect(res.status).toBe(200);
        expect(res.body.b_status).toBe(true);
    });

    it('Check Order Delete Endpoint', async () => {
        const res = await request
            .delete(`/orders`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id: order.id
            });
        expect(res.status).toBe(200);
    });


});