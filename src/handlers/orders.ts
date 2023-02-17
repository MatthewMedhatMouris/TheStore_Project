import express, { Request, Response } from 'express';
import { Verify } from '../helpers/jwtHelper';
import { Orders_DB } from '../models/orders';
import Orders from '../types/order';
import OrderProducts from '../types/orderProduct';

const ordersDB = new Orders_DB();

//////////////////////Index Mehtod///////////////////////////////////////
const index = async (req: Request, res: Response) => {
    try {
        Verify(req);
        const orders = await ordersDB.index();
        res.json(orders);
    }
    catch (err) {
        const e = err as Error;
        if (e.message.includes('Failed to get the orders')) {
            res.status(500).json(e.message);
        } else {
            res.status(401).json(e.message);
        }
    }

};


//////////////////////GetOne Mehtod///////////////////////////////////////
const getOne = async (req: Request, res: Response) => {
    try {
        Verify(req);
        const id = req.params.id;
        const order = await ordersDB.getOne(id);
        res.send(order);
    } catch (error) {
        const e = error as Error;
        if (e.message.includes('Failed to get the order')) {
            res.status(500).json(e.message);
        } else {
            res.status(401).json(e.message);
        }
    }
};

//////////////////////Current Order Mehtod///////////////////////////////////////
const currentOrder = async (req: Request, res: Response) => {
    try {
        Verify(req);
        const orderId = req.body.id;
        const userId = req.body.userId;
        const order = await ordersDB.currentOrder(orderId,userId);
        res.send(order);
    } catch (error) {
        const e = error as Error;
        if (e.message.includes('Failed to get the current order')) {
            res.status(500).json(e.message);
        } else {
            res.status(401).json(e.message);
        }
    }
};



//////////////////////Create Mehtod///////////////////////////////////////
const create = async (req: Request, res: Response) => {
    try {
        Verify(req);
        const order: Orders = {
            d_date: req.body.d_date,
            n_total_price: req.body.n_total_price,
            s_user_id: req.body.s_user_id,
            b_status: req.body.b_status,
        };
        const orderProducts: OrderProducts[] = req.body.orderProducts?.map(
            (orderProduct: OrderProducts) => {
                return {
                    s_order_id: orderProduct.s_order_id,
                    s_product_id: orderProduct.s_product_id,
                    n_quantity: orderProduct.n_quantity,
                } as OrderProducts;
            }
        );

        const newOrder = await ordersDB.create(order, orderProducts);
        res.json(newOrder);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};



//////////////////////Confirm Order Mehtod///////////////////////////////////////
const confirmOrder = async (req: Request, res: Response) => {
    try {
        Verify(req);
        const { id,s_user_id,b_status } = req.body;
        const editOrder = await ordersDB.confirmOrder(b_status,id,s_user_id);
        res.send(editOrder);
    } catch (error) {
        const e = error as Error;
        if (e.message.includes('Failed to update order status')) {
            res.status(500).json(e.message);
        } else {
            res.status(401).json(e.message);
        }
    }
};




//////////////////////Delete Mehtod///////////////////////////////////////
const remove = async (req: Request, res: Response) => {
    try {
        Verify(req);
        const id = req.body.id;
        const deletedOrder = await ordersDB.delete(id);
        res.send(deletedOrder);
    } catch (error) {
        const e = error as Error;
        if (e.message.includes('Failed to delete order')) {
            res.status(500).json(e.message);
        } else {
            res.status(401).json(e.message);
        }
    }
};


const orders_routes = (app: express.Application) => {
    app.get('/orders', index);
    app.get('/orders/:id', getOne);
    app.get('/currentOrder', currentOrder);
    app.post('/orders', create);
    app.patch('/confirmorder', confirmOrder);
    app.delete('/orders', remove);
};

export default orders_routes;
