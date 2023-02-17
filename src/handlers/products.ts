import express, { Request, Response } from 'express';
import { Products_DB } from '../models/products';
import Products from '../types/product';
import { Verify } from '../helpers/jwtHelper';

const productsDB = new Products_DB();

//////////////////////Index Mehtod///////////////////////////////////////
const index = async (req: Request, res: Response) => {
  Verify(req);

  const products = await productsDB.index();
  res.json(products);
};


//////////////////////GetOne Mehtod///////////////////////////////////////
const getOne = async (req: Request, res: Response) => {
  try {
    Verify(req);
    const id = req.params.id;
    const product = await productsDB.getOne(id);
    res.send(product);
  } catch (error) {
    const e = error as Error;
    if (e.message.includes('Failed to get the product')) {
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
    const product: Products = {
      s_name: req.body.s_name,
      s_description: req.body.s_description,
      n_price: req.body.n_price,
    };

    const newProduct = await productsDB.create(product);
    res.json(newProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

//////////////////////Update Mehtod///////////////////////////////////////
const update = async (req: Request, res: Response) => {
  try {
    Verify(req);
    const { id, s_name, s_description, n_price } = req.body;
    const product: Products = { id, s_name, s_description, n_price };
    const editProduct = await productsDB.update(product);
    res.send(editProduct);
  } catch (error) {
    const e = error as Error;
    if (e.message.includes('Failed to update product')) {
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
    const deletedProduct = await productsDB.delete(id);
    res.send(deletedProduct);
  } catch (error) {
    const e = error as Error;
    if (e.message.includes('Failed to delete product')) {
      res.status(500).json(e.message);
    } else {
      res.status(401).json(e.message);
    }
  }
};

const products_routes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', getOne);
  app.post('/products', create);
  app.put('/products', update);
  app.delete('/products', remove);
};

export default products_routes;
