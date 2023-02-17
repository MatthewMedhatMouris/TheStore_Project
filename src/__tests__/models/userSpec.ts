import client from '../../database';
import { Users_DB } from '../../models/users';
import Users from '../../types/user';

const userModel: Users_DB = new Users_DB();

describe('Test User Model', (): void => {
    describe('Check methods in User Model', (): void => {
        it('Should have index method to get all users', () => {
            expect(userModel.index).toBeDefined();
        });
        it('Should have getOne method to get specific users', () => {
            expect(userModel.getOne).toBeDefined();
        });
        it('Should have create method to create user', () => {
            expect(userModel.create).toBeDefined();
        });
        it('Should have update method to update user', () => {
            expect(userModel.update).toBeDefined();
        });
        it('Should have delete method to delete user', () => {
            expect(userModel.delete).toBeDefined();
        });
        it('Should have authenticate method which generate token', () => {
            expect(userModel.authenticate).toBeDefined();
        });
    });

    describe('Test User Model Logic', (): void => {
        const user: Users = {
            s_name: 'admin',
            s_email: 'admin@gmail.com',
            s_password: '123',
        } as Users;
        beforeAll(async () => {
            const currentUser = await userModel.create(user);
            user.id = currentUser?.id;
        });
        afterAll(async () => {
            const conn = await client.connect();
            const sql = `DELETE FROM users;`;
            await conn.query(sql);
            conn.release();
        });

        it('Authenticate method return user token', async () => {
            const userInfo: Users | null = await userModel.authenticate(user.s_name, user.s_email, user.s_password);
            expect(userInfo).toEqual({
                id: user.id,
                s_name: 'admin',
                s_email: 'admin@gmail.com',
                s_password: userInfo?.s_password,
            } as Users);
        });

        it('Create method return new user', async () => {
            const new_user: Users = await userModel.create({
                s_name: 'Matthew',
                s_email: 'matthew@gmail.com',
                s_password: '123',
            } as Users);
            expect(new_user).toEqual({
                id: new_user.id,
                s_name: 'Matthew',
                s_email: 'matthew@gmail.com',
            } as Users);
        });

        it('Index method return all users', async () => {
            const users: Users[] = await userModel.index();
            expect(users.length).toEqual(2);
        });

        it('GetOne method return specific user', async () => {
            const userInfo: Users = await userModel.getOne(user.id as string);
            expect(userInfo).toEqual({
                id: user.id,
                s_name: 'admin',
                s_email: 'admin@gmail.com',
                s_password: userInfo.s_password,
            } as Users);
        });

        it('Update method return user which updated', async () => {
            const userInfo: Users = await userModel.update({
                id: user.id,
                s_name: 'John',
                s_email: 'john@gmail.com',
                s_password: '123'
            } as Users);
            expect(userInfo).toEqual({
                id: user.id,
                s_name: 'John',
                s_email: 'john@gmail.com',
            } as Users);
        });

        

        it('Delete method return user which deleted', async () => {
            const userInfo: Users = await userModel.delete(user.id as string);
            expect(userInfo).toEqual({
                id: user.id,
                s_name: 'John',
                s_email: 'john@gmail.com',
            } as Users);
        });

        

    });
});