import { RequestHandler } from "express";
import { UserServices } from "./user.service";

const createAdmin: RequestHandler = async (req, res) => {
  const result = await UserServices.createAdminIntoDB();
  res.send(result);
};

export const UserController = {
  createAdmin,
};
