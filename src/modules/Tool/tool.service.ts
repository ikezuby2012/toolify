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
 * @returns {Promise<IToolDoc | null>}
 */
export const updateToolById = async (
  userId: mongoose.Types.ObjectId,
  updateTool: UpdateToolBody
): Promise<IToolDoc | null> => {
  const tool = await getToolById(userId);
  if (!tool) {
    throw new ApiError(httpStatus.NOT_FOUND, "tool not found");
  }

  Object.assign(tool, updateTool);
  await tool.save();
  return tool;
};
