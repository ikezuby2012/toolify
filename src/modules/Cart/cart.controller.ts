import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../utils";
import Cart from "./cart.model";

export const AddToCart = catchAsync(async (req: Request, res: Response) => {
  const newCart = await Cart.create({
    userId: req.body.userId,
    tool: req.body.tool,
    quantity: req.body.quantity,
  });

  res.status(httpStatus.OK).json({
    status: "success",
    data: newCart,
  });
});
