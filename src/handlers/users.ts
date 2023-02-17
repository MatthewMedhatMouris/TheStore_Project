import express, { Request, Response } from 'express';
import { Users_DB } from '../models/users';
import { Sign, Verify } from '../helpers/jwtHelper';
import Users from '../types/user';

const users = new Users_DB();

//////////////////////Index Method/////////////////////////
const index = async (req: Request, res: Response) => {
  try {
    Verify(req);
    const users_result = await users.index();
    res.json(users_result);
  }
  catch (err) {
    const e = err as Error;
    if (e.message.includes('Failed to get the users')) {
      res.status(500).json(e.message);
    } else {
      res.status(401).json(e.message);
    }
  }

};


////////////////////////GetOne Mehtod////////////////////////////////////
const getOne = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await users.getOne(id);
    res.send(user);
  } catch (error) {
    const e = error as Error;
    if (e.message.includes('Failed to get the user')) {
      res.status(500).json(e.message);
    } else {
      res.status(401).json(e.message);
    }
  }
};


////////////////////////Create Mehtod////////////////////////////////////
const create = async (req: Request, res: Response) => {
  try {
    Verify(req);
    const user: Users = {
      s_name: req.body.s_name,
      s_email: req.body.s_email,
      s_password: req.body.s_password,
    };
    const newUser = await users.create(user);

    res.json(newUser);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

////////////////////////Update Mehtod////////////////////////////////////
const update = async (req: Request, res: Response) => {
  try {
    Verify(req);
    const { id, s_name, s_email, s_password } = req.body;
    const user: Users = { id, s_name, s_email, s_password };
    const editUser = await users.update(user);
    res.send(editUser);
  } catch (error) {
    const e = error as Error;
    if (e.message.includes('Failed to update user')) {
      res.status(500).json(e.message);
    } else {
      res.status(401).json(e.message);
    }
  }
};

////////////////////////Delete Mehtod////////////////////////////////////
const remove = async (req: Request, res: Response) => {
  try {
    Verify(req);
    const id = req.body.id;
    const deletedUser = await users.delete(id);
    res.send(deletedUser);
  } catch (error) {
    const e = error as Error;
    if (e.message.includes('Failed to delete user')) {
      res.status(500).json(e.message);
    } else {
      res.status(401).json(e.message);
    }
  }
};


////////////////////////Authenticate Mehtod////////////////////////////////////
const authenticate = async (req: Request, res: Response) => {
  const user: Users = {
    s_name: req.body.s_name,
    s_email: req.body.s_email,
    s_password: req.body.s_password,
  };

  try {
    const currentUser = await users.authenticate(
      user.s_name,
      user.s_email,
      user.s_password
    );
    if (currentUser === null) {
      res.status(401);
      res.json('Incorrect user information');
    } else {
      const token = Sign(currentUser.id as string);
      res.json(token);
    }
  } catch (error) {
    const e = error as Error;
    res.status(401).send(e.message);
  }
};

const users_routes = (app: express.Application) => {
  app.get('/users', index);
  app.get('/users/:id', getOne);
  app.post('/users', create);
  app.put('/users', update);
  app.delete('/users', remove);
  app.post('/users/authenticate', authenticate);
};

export default users_routes;
