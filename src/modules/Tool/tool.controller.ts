import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage, Options } from "multer-storage-cloudinary";
import multer from "multer";
import { catchAsync } from "../utils";
import ApiError from "../errors/ApiError";

import Tool from "./tool.model";

import config from "../../config";
import * as toolService from "./tool.service";

cloudinary.config({
  cloud_name: "dilvag5dx",
  api_key: config.cloud.apiKey,
  api_secret: config.cloud.apiSecret,
});

const cloudStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    allowed_formats: ["jpg", "png"],
    folder: () => "toolify",
  },
} as Options);

const parser = multer({ storage: cloudStorage });

export const uploadImage = parser.single("image");

export const createNewTool = catchAsync(
  async (req: Request | any, res: Response) => {
    const {
      category,
      title,
      description,
      make,
      model,
      equipmentDelivery0rReturn,
      availableQuantity,
      availableLocation,
      creatorId,
    } = req.body;

    const tool = {
      category,
      title,
      description,
      make,
      model,
      equipmentDelivery0rReturn,
      paymentPlan: {
        daily: parseInt(req.body["paymentPlan.daily"], 10),
        weekly: parseInt(req.body["paymentPlan.weekly"], 10),
        monthly: parseInt(req.body["paymentPlan.monthly"], 10),
      },
      availableQuantity: parseInt(availableQuantity, 10),
      availableLocation,
      creatorId,
      image: req.file ? req.file.path : req.body.image ?? "",
    };

    const newTool = await Tool.create(tool);

    res.status(httpStatus.OK).json({
      status: "success",
      data: newTool,
    });
  }
);

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
