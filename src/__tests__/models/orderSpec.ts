import client from '../../database';
import { Orders_DB } from '../../models/orders';
import { Users_DB } from '../../models/users';
import Orders from '../../types/order';
import Users from '../../types/user';
import { Products_DB } from '../../models/products';
import Products from '../../types/product';
import OrderProducts from '../../types/orderProduct';
import convertToDate from '../../helpers/convertToDate';
import OrderDetails from '../../types/orderDetails';

const userModel: Users_DB = new Users_DB();
const productModel: Products_DB = new Products_DB();
const orderModel: Orders_DB = new Orders_DB();

describe('Test Order Model', (): void => {
    describe('Check methods in Order Model', (): void => {
        it('Should have index method to get all orders', () => {
            expect(orderModel.index).toBeDefined();
        });
        it('Should have getOne method to get specific order', () => {
            expect(orderModel.getOne).toBeDefined();
        });
        it('Should have create method to create order', () => {
            expect(orderModel.create).toBeDefined();
        });
        it('Should have delete method to delete order', () => {
            expect(orderModel.delete).toBeDefined();
        });
    });

    describe('Test Order Model Logic', (): void => {
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

        beforeAll(async () => {
            const currentUser = await userModel.create(user);
            user.id = currentUser?.id;

            const currentProduct1 = await productModel.create(product);
            product.id = currentProduct1.id;

            const currentProduct2 = await productModel.create(product2);
            product2.id = currentProduct2.id;

            order = {
                d_date: '2021-01-13',
                n_total_price: '6000',
                s_user_id: user.id,
                b_status: false
            } as unknown as Orders;

            const orderProducts: OrderProducts[] = [{
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

        it('Create method return new order', async () => {
            const new_order: Orders = await orderModel.create({
                d_date: '2021-01-14',
                n_total_price: '11000',
                s_user_id: user.id,
                b_status: false,
            } as unknown as Orders, [{
                s_product_id: product.id as string,
                n_quantity: 1,
            }, {
                s_product_id: product2.id as string,
                n_quantity: 1,
            }] as OrderProducts[]);
            new_order.d_date = convertToDate(new_order.d_date.toString()) as unknown as Date;
            expect(new_order).toEqual({
                id: new_order.id,
                d_date: '2021-01-14',
                n_total_price: '11000',
                s_user_id: user.id,
                b_status: false,
            } as unknown as Orders);
        });

        it('Index method return all orders', async () => {
            const orderDetails: OrderDetails[] = await orderModel.index();
            expect(orderDetails.length).toEqual(2);
        });

        it('GetOne method return specific order', async () => {
            const orderDetails: OrderDetails = await orderModel.getOne(order.id as string);
            orderDetails.d_date = convertToDate(orderDetails.d_date.toString()) as unknown as Date;
            expect(orderDetails).toEqual({
                order_id: order.id,
                d_date: '2021-01-13',
                n_total_price: order.n_total_price,
                s_user_name: user.s_name,
                b_status: false,
                productDetails: orderDetails.productDetails,
            } as unknown as OrderDetails);
        });

        it('CurrentOrder method return specific order depend on user id', async () => {
            const orderDetails: OrderDetails = await orderModel.currentOrder(order.id as string, order.s_user_id);
            orderDetails.d_date = convertToDate(orderDetails.d_date.toString()) as unknown as Date;
            expect(orderDetails).toEqual({
                order_id: order.id,
                d_date: '2021-01-13',
                n_total_price: order.n_total_price,
                s_user_name: user.s_name,
                b_status: false,
                productDetails: orderDetails.productDetails,
            } as unknown as OrderDetails);
        });

        it('ConfirmOrder method will edit the order status from active to complete', async () => {
            const orderInfo: Orders = await orderModel.confirmOrder(true, order.id as string, user.id as string);
            orderInfo.d_date = convertToDate(orderInfo.d_date.toString()) as unknown as Date;
            expect(orderInfo).toEqual({
                id: order.id,
                d_date: '2021-01-13',
                n_total_price: order.n_total_price,
                s_user_id: user.id,
                b_status: true
            } as unknown as Orders);
        });

        it('Delete method return order which deleted', async () => {
            const orderInfo: Orders = await orderModel.delete(order.id as string);
            orderInfo.d_date = convertToDate(orderInfo.d_date.toString()) as unknown as Date;
            expect(orderInfo).toEqual({
                id: order.id,
                d_date: '2021-01-13',
                n_total_price: '6000',
                s_user_id: user.id,
                b_status: orderInfo.b_status,
            } as unknown as Orders);
        });
    });
});

