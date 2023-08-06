import httpStatus from "http-status";
import mongoose from "mongoose";

import { IToolDoc, UpdateToolBody } from "./tool.interface";
import Tool from "./tool.model";
import { ApiError } from "../errors";

/**
 * Get user by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IUserDoc | null>}
 */
export const getToolById = async (
  id: mongoose.Types.ObjectId
): Promise<IToolDoc | null> => Tool.findById(id);

/**
 * Update tool by id
 * @param {mongoose.Types.ObjectId} userId
 * @param {UpdateToolBody} updateBody
 * @param {any} image
 * @returns {Promise<IToolDoc | null>}
 */
export const updateToolById = async (
  toolId: mongoose.Types.ObjectId,
  updateTool: UpdateToolBody,
  image: any
): Promise<IToolDoc | null> => {
  const tool = await getToolById(toolId);

  const {
    category,
    title,
    description,
    make,
    model,
    equipmentDelivery0rReturn,
    availableQuantity,
    availableLocation,
    paymentPlanDaily,
    paymentPlanWeekly,
    paymentPlanMonthly,
  } = updateTool as any;

  if (!tool) {
    throw new ApiError(httpStatus.NOT_FOUND, "tool not found");
  }

  const updatedTool = await Tool.findByIdAndUpdate(
    toolId,
    {
      category,
      title,
      description,
      make,
      model,
      equipmentDelivery0rReturn,
      availableQuantity: availableQuantity && parseInt(availableQuantity, 10),
      availableLocation,
      image,
      paymentPlan: {
        daily: paymentPlanDaily && parseInt(paymentPlanDaily, 10),
        weekly: paymentPlanWeekly && parseInt(paymentPlanWeekly, 10),
        monthly: paymentPlanMonthly && parseInt(paymentPlanMonthly, 10),
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return updatedTool;
};
