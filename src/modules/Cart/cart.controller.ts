import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../utils";
import Cart from "./cart.model";
import * as cartService from "./cart.service";

export const BorrowTool = catchAsync(
  async (req: Request | any, res: Response) => {
    const newCart = await Cart.create({
      userId: req.user.id,
      tool: req.body.tool,
      quantity: req.body.quantity,
    });

    res.status(httpStatus.OK).json({
      status: "success",
      data: newCart,
    });
  }
);

// export const RemoveTool = catchAsync(async (req: Request, res: Response) => {

// });

export const getUserBorrowedTools = catchAsync(
  async (req: Request | any, res: Response) => {
    const userTools = (await cartService.getBorrowedTools(req.user.id)) as any;

    res.status(httpStatus.OK).json({
      status: "success",
      length: userTools?.length,
      data: userTools,
    });
  }
);
