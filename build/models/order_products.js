"use strict";
// import client from '../database';
// export type OrderProducts = {
//   id?: string;
//   s_order_id: string;
//   s_produt_id: string;
//   n_quantity: number;
// };
// export class Orders_DB {
//     //////////////////////Index Mehtod///////////////////////////////////////
//     async index(): Promise<Orders[]> {
//       try {
//         const conn = await client.connect();
//         const sql = 'Select * from orders';
//         const result = await conn.query(sql);
//         conn.release();
//         // console.log(result.rows);
//         return result.rows;
//       } catch (err) {
//         throw new Error(`Cannot get orders ${err}`);
//       }
//     }
//     //////////////////////GetOne Mehtod///////////////////////////////////////
//     async getOne(id: string): Promise<Orders> {
//       try {
//         const connection = await client.connect();
//         const sql = 'SELECT * FROM orders WHERE id=($1)';
//         const result = await connection.query(sql, [id]);
//         connection.release();
//         return result.rows[0];
//       } catch (error) {
//         throw new Error(
//           `Failed to get the order with the following error: ${error}`
//         );
//       }
//     }
//     //////////////////////Create Mehtod///////////////////////////////////////
//     async create(order: Orders): Promise<Orders> {
//       try {
//         const conn = await client.connect();
//         const sql =
//           'INSERT INTO orders (d_date,n_total_price,s_user_id) VALUES($1, $2, $3) RETURNING *';
//         const result = await conn.query(sql, [
//           order.d_date,
//           order.n_total_price,
//           order.s_user_id
//         ]);
//         const order_result = result.rows[0];
//         conn.release();
//         return order_result;
//       } catch (err) {
//         throw new Error(`Could not add new order. Error: ${err}`);
//       }
//     }
//     //////////////////////Update Mehtod///////////////////////////////////////
//     async update(order: Orders): Promise<Orders> {
//       try {
//         const connection = await client.connect();
//         const sql = 'UPDATE orders SET d_date=($1),n_total_price=($2),s_user_id=($3) WHERE id=($4) RETURNING *';
//         const result = await connection.query(sql, [order.d_date, order.n_total_price, order.s_user_id,order.id]);
//         connection.release();
//         return result.rows[0];
//       } catch (error) {
//         throw new Error(
//           `Failed to update order with the following error: ${error}`
//         );
//       }
//     }
//     //////////////////////Update Mehtod///////////////////////////////////////
//     async delete(id: string): Promise<Orders> {
//       try {
//         const connection = await client.connect();
//         const sql = 'DELETE FROM orders WHERE id=($1) RETURNING *';
//         const result = await connection.query(sql, [id]);
//         connection.release();
//         return result.rows[0];
//       } catch (error) {
//         throw new Error(
//           `Failed to delete order with the following error: ${error}`
//         );
//       }
//     }
//   }
