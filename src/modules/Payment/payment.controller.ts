import { Request, Response } from "express";
import httpStatus from "http-status";
import mongoose from "mongoose";
import { catchAsync, pick } from "../utils";
import Payment from "./payment.model";
import * as paymentService from "./payment.service";
import { IOptions } from "../paginate/paginate";

export const PostPayment = catchAsync(
  async (req: Request | any, res: Response) => {
    const body = { ...req.body, userId: req.user.id };

    const newPayment = await Payment.create(body);

    res.status(httpStatus.OK).json({
      status: "success",
      data: newPayment,
    });
  }
);

export const getAllPayment = catchAsync(async (req: Request, res: Response) => {
  const options: IOptions = pick(req.query, [
    "sortBy",
    "limit",
    "page",
    "projectBy",
  ]);
  const { results, page, limit, totalPages, totalResults } =
    await paymentService.queryDocs({}, options);

  res.status(httpStatus.OK).json({
    status: "success",
    data: results,
    info: {
      page,
      limit,
      totalPages,
      totalResults,
    },
  });
});

export const getPaymentById = catchAsync(
  async (req: Request, res: Response) => {
    if (typeof req.params.id === "string") {
      const payment = await paymentService.getPaymentById(
        new mongoose.Types.ObjectId(req.params.id)
      );

      res.status(httpStatus.OK).json({
        status: "success",
        data: payment,
      });
    }
  }
);

export const getUsersPaymentHistory = catchAsync(
  async (req: Request | any, res: Response) => {
    const payments = (await paymentService.getPaymentCreatedId(
      req.user.id
    )) as any;

    res.status(httpStatus.OK).json({
      status: "success",
      length: payments?.length,
      data: payments,
    });
  }
);

export const deletePaymentById = catchAsync(
  async (req: Request, res: Response) => {
    if (typeof req.params.id === "string") {
      await paymentService.deletePaymentById(
        new mongoose.Types.ObjectId(req.params.id)
      );
      res.status(httpStatus.NO_CONTENT).send();
    }
  }
);
