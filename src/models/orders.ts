import client from '../database';
import Orders from '../types/order';
import OrderDetails from '../types/orderDetails';
import OrderName from '../types/orderName';
import OrderProducts from '../types/orderProduct';
import ProductDetails from '../types/productDetails';

export class Orders_DB {

    //////////////////////Index Mehtod///////////////////////////////////////
    async index(): Promise<OrderDetails[]> {
        try {
            const conn = await client.connect();
            const sql = `Select orders.id as order_id, orders.d_date, orders.n_total_price, products.id as product_id, products.s_name as product_name, products.s_description as description, products.n_price, order_products.n_quantity, users.s_name as user_name from order_products 
                Inner Join orders on order_products.s_order_id = orders.id
                Inner Join products on order_products.s_product_id = products.id
                Inner Join users on orders.s_user_id = users.id`;
            const result = await conn.query(sql);
            conn.release();
            const data: OrderDetails[] = this.resultData(result.rows);
            return data;
        } catch (err) {
            throw new Error(`Cannot get orders ${err}`);
        }
    }

    //////////////////////GetOne Mehtod///////////////////////////////////////
    async getOne(id: string): Promise<OrderDetails> {
        try {
            const connection = await client.connect();
            const sql = `Select orders.id as order_id, orders.d_date, orders.n_total_price, products.id as product_id, products.s_name as product_name, products.n_price, order_products.n_quantity, users.s_name as user_name, orders.b_status from order_products 
            Inner Join orders on order_products.s_order_id = orders.id
            Inner Join products on order_products.s_product_id = products.id
            Inner Join users on orders.s_user_id = users.id where orders.id=($1);`;
            const result = await connection.query(sql, [id]);
            connection.release();
            const data: OrderDetails[] = this.resultData(result.rows);
            return data[0];
        } catch (error) {
            throw new Error(
                `Failed to get the order with the following error: ${error}`
            );
        }
    }

    //////////////////////Current Order Mehtod///////////////////////////////////////
    async currentOrder(orderId: string, userId: string): Promise<OrderDetails> {
        try {
            const connection = await client.connect();
            const sql = `Select orders.id as order_id, orders.d_date, orders.n_total_price, products.id as product_id, products.s_name as product_name, products.n_price, order_products.n_quantity, users.s_name as user_name, orders.b_status from order_products 
            Inner Join orders on order_products.s_order_id = orders.id
            Inner Join products on order_products.s_product_id = products.id
            Inner Join users on orders.s_user_id = users.id where orders.id=($1) and users.id=($2) and orders.b_status=false;`;
            const result = await connection.query(sql, [orderId, userId]);
            connection.release();
            const data: OrderDetails[] = this.resultData(result.rows);
            return data[0];
        } catch (error) {
            throw new Error(
                `Failed to get the current order with the following error: ${error}`
            );
        }
    }


    //////////////////////Create Mehtod///////////////////////////////////////
    async create(order: Orders, orderProducts: OrderProducts[]): Promise<Orders> {
        try {
            const conn = await client.connect();
            const sql =
                'INSERT INTO orders (d_date,n_total_price,s_user_id) VALUES($1, $2, $3) RETURNING *';

            const result = await conn.query(sql, [
                order.d_date,
                order.n_total_price,
                order.s_user_id
            ]);

            const order_result = result.rows[0];
            conn.release();

            if (result.rows.length) {
                orderProducts.forEach(async (orderProduct: OrderProducts) => {
                    orderProduct.s_order_id = order_result.id as string;
                    await this.addProduct(orderProduct);
                });
            }

            return order_result;
        } catch (err) {
            throw new Error(`Could not add new order. Error: ${err}`);
        }
    }

    //////////////////////AddProduct Mehtod///////////////////////////////////////
    async addProduct(orderProduct: OrderProducts) {
        try {
            const conn = await client.connect();
            const sql =
                'INSERT INTO order_products (s_order_id, s_product_id, n_quantity) VALUES($1, $2, $3) RETURNING *';
            const result = await conn.query(sql, [orderProduct.s_order_id, orderProduct.s_product_id, orderProduct.n_quantity]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(
                `Could not add product ${orderProduct.s_product_id} to order ${orderProduct.s_order_id}: ${error}`
            );
        }
    }

    //////////////////////Confirm Order Mehtod///////////////////////////////////////
    async confirmOrder(b_status: boolean, id: string, s_user_id: string): Promise<Orders> {
        try {
            const connection = await client.connect();
            const sql = 'UPDATE orders SET b_status=($1) WHERE id=($2) and s_user_id=($3) RETURNING *';
            const result = await connection.query(sql, [b_status, id, s_user_id]);
            connection.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(
                `Failed to update order status with the following error: ${error}`
            );
        }
    }


    //////////////////////Delete Mehtod///////////////////////////////////////
    async delete(id: string): Promise<Orders> {
        try {
            const connection = await client.connect();
            const sql = 'DELETE FROM orders WHERE id=($1) RETURNING *';
            const result = await connection.query(sql, [id]);
            connection.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(
                `Failed to delete order with the following error: ${error}`
            );
        }
    }


    private resultData(data: OrderName[]): OrderDetails[] {
        const result: OrderDetails[] = [];
        data.forEach((order: OrderName) => {
            const singleOrder: OrderDetails | undefined = result.find(
                (item: OrderDetails) => item.order_id === order.order_id);

            if (!singleOrder) {
                const products: OrderName[] = data.filter((item: OrderName) => item.order_id === order.order_id);
                const productDetails: ProductDetails[] = [];
                products.forEach((product: OrderName) => {
                    productDetails.push({
                        s_name: product.product_name,
                        n_price: product.n_price,
                        quantity: product.n_quantity
                    })
                });
                result.push({
                    order_id: order.order_id,
                    d_date: order.d_date,
                    n_total_price: order.n_total_price,
                    s_user_name: order.user_name,
                    b_status: order.b_status,
                    productDetails: productDetails,
                })
            }
        });
        return result;
    }




}



