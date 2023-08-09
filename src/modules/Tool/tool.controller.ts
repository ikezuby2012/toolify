import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage, Options } from "multer-storage-cloudinary";
import multer from "multer";
import { catchAsync, pick } from "../utils";
import ApiError from "../errors/ApiError";

import Tool from "./tool.model";

import config from "../../config";
import * as toolService from "./tool.service";
import { IOptions } from "../paginate/paginate";

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
      creatorId: req.user.id,
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
  async (req: Request | any, res: Response, next: NextFunction) => {
    const image = req.file && req.file.path;
    if (typeof req.params.id === "string") {
      const tool = await toolService.updateToolById(
        new mongoose.Types.ObjectId(req.params.id),
        req.body,
        image
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

export const getAllTools = catchAsync(async (req: Request, res: Response) => {
  const options: IOptions = pick(req.query, [
    "sortBy",
    "limit",
    "page",
    "projectBy",
  ]);
  const result = await toolService.queryDocs({}, options);

  res.status(httpStatus.OK).json({
    status: "success",
    data: result,
  });
});

export const getToolById = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params.id === "string") {
    const tool = await toolService.getToolById(
      new mongoose.Types.ObjectId(req.params.id)
    );

    res.status(httpStatus.OK).json({
      status: "success",
      data: tool,
    });
  }
});

export const getUsersTool = catchAsync(
  async (req: Request | any, res: Response) => {
    const userTools = (await toolService.getToolCreatedId(req.user.id)) as any;

    res.status(httpStatus.OK).json({
      status: "success",
      length: userTools?.length,
      data: userTools,
    });
  }
);

export const searchTool = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { search } = pick(req.query, ["search"]);
    const { id } = req.params;

    const types = ["category"];

    if (!types.includes(search)) {
      return next(
        new ApiError(httpStatus.NOT_ACCEPTABLE, "query type is not allowed")
      );
    }

    const data = await Tool.find({ category: id });

    res.status(httpStatus.OK).json({
      status: "success",
      data,
    });
  }
);
