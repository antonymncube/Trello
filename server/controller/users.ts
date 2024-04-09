import { NextFunction, Request, Response } from "express"; // Import Response from Express
import UserModel from '../src/models/User'

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const newUser = new UserModel({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    });

    console.log("newUser", newUser);
    const savedUser = await newUser.save();
    console.log("saved new User", savedUser);

    // Send a response if needed
    res.status(201).json(savedUser);
  } catch (err) {
    next(err);
  }
};
