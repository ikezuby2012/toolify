import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import mongoose from "mongoose";
import { catchAsync } from "../utils";
import ApiError from "../errors/ApiError";

import Tool from "./tool.model";
import * as toolService from "./tool.service";

export const createNewTool = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body, "req body");

  const newTool = await Tool.create(req.body);

  res.status(httpStatus.OK).json({
    status: "success",
    data: newTool,
  });
});

export const updateTool = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (typeof req.params.Id === "string") {
      const tool = await toolService.updateToolById(
        new mongoose.Types.ObjectId(req.params.userId),
        req.body
      );

      res.status(httpStatus.OK).json({
        status: "success",
        data: tool,
      });
    } else {
      return next(new ApiError(httpStatus.NOT_FOUND, "id is required"));
    }
  }
);
