import client from '../database';
import Products from '../types/product';


export class Products_DB {

  //////////////////////Index Mehtod///////////////////////////////////////
  async index(): Promise<Products[]> {
    try {
      const conn = await client.connect();
      const sql = 'Select * from products';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get products ${err}`);
    }
  }

  //////////////////////GetOne Mehtod///////////////////////////////////////
  async getOne(id: string): Promise<Products> {
    try {
      const connection = await client.connect();
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Failed to get the product with the following error: ${error}`
      );
    }
  }


  //////////////////////Create Mehtod///////////////////////////////////////
  async create(product: Products): Promise<Products> {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO products (s_name,s_description,n_price) VALUES($1, $2, $3) RETURNING *';

      const result = await conn.query(sql, [
        product.s_name,
        product.s_description,
        product.n_price
      ]);
      const product_result = result.rows[0];

      conn.release();

      return product_result as Products;
    } catch (err) {
      throw new Error(`Could not add new product. Error: ${err}`);
    }
  }


  //////////////////////Update Mehtod///////////////////////////////////////
  async update(product: Products): Promise<Products> {
    try {
      const connection = await client.connect();
      const sql = 'UPDATE products SET s_name=($1),s_description=($2),n_price=($3) WHERE id=($4) RETURNING *';
      const result = await connection.query(sql, [product.s_name, product.s_description, product.n_price,product.id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Failed to update product with the following error: ${error}`
      );
    }
  }


  //////////////////////Update Mehtod///////////////////////////////////////
  async delete(id: string): Promise<Products> {
    try {
      const connection = await client.connect();
      const sql = 'DELETE FROM products WHERE id=($1) RETURNING *';
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Failed to delete product with the following error: ${error}`
      );
    }
  }
}
