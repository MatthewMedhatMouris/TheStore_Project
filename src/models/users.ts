// import { title } from 'process';
import client from '../database';
import bcrypt from 'bcrypt';
import Users from '../types/user';

const { PEPPER, SALT_ROUNDS } = process.env;

export class Users_DB {

  ///////////////////////Index Method///////////////////////////////
  async index(): Promise<Users[]> {
    try {
      const conn = await client.connect();
      const sql = 'Select * from users';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get products ${err}`);
    }
  }

  ////////////////////////GetOne Method/////////////////////////////
  async getOne(id: string): Promise<Users> {
    try {
      const connection = await client.connect();
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Failed to get the user with the following error: ${error}`
      );
    }
  }


  ////////////////////////Create Method/////////////////////////////
  async create(user: Users): Promise<Users> {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO users (s_name, s_email, s_password) VALUES($1, $2, $3) RETURNING id, s_name, s_email';

      const hash = bcrypt.hashSync(
        user.s_password + PEPPER,
        Number(SALT_ROUNDS)
      );
      const result = await conn.query(sql, [user.s_name, user.s_email, hash]);

      const user_result = result.rows[0];
      conn.release();

      return user_result;
    } catch (err) {
      throw new Error(`Could not add new user. Error: ${err}`);
    }
  }


  //////////////////////////Update Method////////////////////////////////////////////////////
  async update(user: Users): Promise<Users> {
    try {
      const conn = await client.connect();
      const sql =
        'UPDATE users SET s_name=($1), s_email=($2),s_password=($3) where id=($4) RETURNING id,s_name,s_email';
      const result = await conn.query(sql, [user.s_name, user.s_email, user.s_password, user.id]);

      conn.release();
      const user_result = result.rows[0];
      return user_result;
    } catch (err) {
      throw new Error(`Could not edit user. Error: ${err}`);
    }
  }

  ///////////////////////Delete Method/////////////////////////////////////
  async delete(id: string): Promise<Users> {
    try {
      const connection = await client.connect();
      const sql = 'DELETE FROM users WHERE id=($1) RETURNING id,s_name,s_email';
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Failed to delete user with the following error: ${error}`
      );
    }
  }


  ///////////////////////Authenticate Method/////////////////////////////////////
  async authenticate(
    username: string,
    email: string,
    password: string
  ): Promise<Users | null> {
    const conn = await client.connect();
    const sql = `SELECT * FROM users WHERE s_name=($1) and s_email=($2);`;
    const result = await conn.query(sql, [username, email]);
    conn.release();
    if (result.rows.length) {
      const userPass = result.rows[0];
      if (bcrypt.compareSync(password + PEPPER, userPass.s_password)) {
        return result.rows[0];
      }
    }
    return null;
  }

}
