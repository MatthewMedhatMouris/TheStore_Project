import { Products_DB } from '../../models/products';
import Users from '../../types/user';
import Products from '../../types/product';
import { Users_DB } from '../../models/users';
import client from '../../database';


const userModel: Users_DB = new Users_DB();
const productModel: Products_DB = new Products_DB();

describe('Test Product Model', (): void => {
    describe('Check methods in Product Model', (): void => {
        it('Should have index method to get all Products', () => {
            expect(productModel.index).toBeDefined();
        });
        it('Should have getOne method to get specific product', () => {
            expect(productModel.getOne).toBeDefined();
        });
        it('Should have create method to create product', () => {
            expect(productModel.create).toBeDefined();
        });
        it('Should have update method to update product', () => {
            expect(productModel.update).toBeDefined();
        });
        it('Should have delete method to delete product', () => {
            expect(productModel.delete).toBeDefined();
        });
    });

    describe('Test Product Model Logic', (): void => {
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

        beforeAll(async () => {
            const currentUser = await userModel.create(user);
            user.id = currentUser?.id;
            const currentProduct = await productModel.create(product);
            product.id = currentProduct.id;
        });

        afterAll(async () => {
            const conn = await client.connect();
            const sql = `DELETE FROM users;
                  DELETE FROM products;`;
            await conn.query(sql);
            conn.release();
        });

        it('Create method return new product', async () => {
            const new_product: Products = await productModel.create({
                s_name: 'Realme',
                s_description: 'testtesttest',
                n_price: 5000,
            } as Products);
            expect(new_product).toEqual({
                id: new_product.id,
                s_name: 'Realme',
                s_description: 'testtesttest',
                n_price: '5000.00' as unknown as number,
            } as Products);
        });

        it('Index method return all products', async () => {
            const products: Products[] = await productModel.index();
            expect(products.length).toEqual(2);
        });

        it('GetOne method return specific product', async () => {
            const productInfo: Products = await productModel.getOne(product.id as string);
            expect(productInfo).toEqual({
                id: product.id,
                s_name: 'OPPO',
                s_description: 'test test',
                n_price: '6000.00' as unknown as number,
            } as Products);
        });

        it('Update method return product which updated', async () => {
            const productInfo: Products = await productModel.update({
                id: product.id,
                s_name: 'Samsung',
                s_description: 'testtesttest',
                n_price: 5000,
            } as Products);
            expect(productInfo).toEqual({
                id: product.id,
                s_name: 'Samsung',
                s_description: 'testtesttest',
                n_price: '5000.00' as unknown as number,
            } as Products);
        });

        it('Delete method return product which deleted', async () => {
            const productInfo: Products = await productModel.delete(product.id as string);
            expect(productInfo).toEqual({
                id: product.id,
                s_name: 'Samsung',
                s_description: 'testtesttest',
                n_price: '5000.00' as unknown as number,
            } as Products);
        });
    });
});